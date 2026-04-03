import React, { Component } from "react";
import io from "socket.io-client";
import { Badge, Input, Button } from "@material-ui/core";
import { Row } from "react-flexbox-grid";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import CallEndIcon from "@material-ui/icons/CallEnd";
import ChatIcon from "@material-ui/icons/Chat";
import Messenger from "./Components/Pages/Messenger/Messenger";
import { message } from "antd";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import ReactScrollableFeed from "react-scrollable-feed";
import UserNotFound from "./Components/Pages/ErrorPages/UserNotFound";
import config from "./config";

const server_url = config.SIGNALING_SERVER;
var socket = null;
var socketId = null;
var connections = {};

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun.services.mozilla.com" },
  ],
};

class Video extends Component {
  constructor(props) {
    super(props);
    this.localVideoref = React.createRef();
    this.videoAvailable = false;
    this.audioAvailable = false;
    this.state = {
      video: false,
      audio: false,
      screen: false,
      showModal: false,
      screenAvailable: false,
      messages: [],
      message: "",
      newmessages: 0,
      askForUsername: true,
      username: "",
      loadingEvent: true,
      eventError: false,
      participants: [],
      showPanel: false,
      showEnd: true
    };
    connections = {};
  }

  componentDidMount() {
    this.getPermissions();
    this.fetchEventData();
  }

  fetchEventData = async () => {
    const { urlParam: eventId } = this.props;
    if (!eventId) return;

    try {
      this.setState({ loadingEvent: true });
      const response = await axios.get(`${config.API_SERVER}/onGoingEvent`);
      const events = response.data;
      const currentEvent = events.find((e) => e.eventId === eventId);
      
      if (currentEvent) {
        this.props.setEventInfo(currentEvent);
        this.setState({ loadingEvent: false });
        
        if (this.props.user && this.props.user._id) {
          axios.post(`${config.API_SERVER}/participant`, {
            eventId: currentEvent.eventId,
            hostCode: currentEvent.hostCode,
            joinCode: currentEvent.eventId + "-",
            email: this.props.user.email,
            userId: this.props.user._id,
          }).catch(err => console.log(err));
        }
      } else {
        this.setState({ loadingEvent: false, eventError: true });
      }
    } catch (error) {
      this.setState({ loadingEvent: false, eventError: true });
    }
  };

  getPermissions = async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => (this.videoAvailable = true))
        .catch(() => (this.videoAvailable = false));

      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => (this.audioAvailable = true))
        .catch(() => (this.audioAvailable = false));

      if (navigator.mediaDevices.getDisplayMedia) {
        this.setState({ screenAvailable: true });
      } else {
        this.setState({ screenAvailable: false });
      }

      if (this.videoAvailable || this.audioAvailable) {
        navigator.mediaDevices
          .getUserMedia({
            video: this.videoAvailable,
            audio: this.audioAvailable,
          })
          .then((stream) => {
            window.localStream = stream;
            if (this.localVideoref.current) {
              this.localVideoref.current.srcObject = stream;
            }
          })
          .catch((e) => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };

  getMedia = () => {
    this.setState({ video: this.videoAvailable, audio: this.audioAvailable }, () => {
      this.getUserMedia();
      this.connectToSocketServer();
    });
  };

  getUserMedia = () => {
    if ((this.state.video && this.videoAvailable) || (this.state.audio && this.audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: this.state.video, audio: this.state.audio })
        .then(this.getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      try {
        if (this.localVideoref.current && this.localVideoref.current.srcObject) {
          let tracks = this.localVideoref.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      } catch (e) {}
    }
  };

  getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {}

    window.localStream = stream;
    if (this.localVideoref.current) {
      this.localVideoref.current.srcObject = stream;
    }

    for (let id in connections) {
      if (id === socketId) continue;
      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description).then(() => {
          socket.emit("signal", id, JSON.stringify({ sdp: connections[id].localDescription }));
        });
      });
    }

    stream.getTracks().forEach(track => {
      track.onended = () => {
        this.setState({ video: false, audio: false }, () => {
          try {
            let tracks = this.localVideoref.current.srcObject.getTracks();
            tracks.forEach((t) => t.stop());
          } catch (e) {}
          let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()]);
          window.localStream = blackSilence();
          if (this.localVideoref.current) this.localVideoref.current.srcObject = window.localStream;
          for (let id in connections) {
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
              connections[id].setLocalDescription(description).then(() => {
                socket.emit("signal", id, JSON.stringify({ sdp: connections[id].localDescription }));
              });
            });
          }
        });
      };
    });
  };

  connectToSocketServer = () => {
    socket = io.connect(server_url, { secure: true });
    socket.on("signal", this.gotMessageFromServer);
    socket.on("connect", () => {
      socket.emit("join-call", window.location.href);
      socketId = socket.id;
      socket.on("chat-message", this.addMessage);
      socket.on("user-left", (id) => {
        if (connections[id]) {
          connections[id].close();
          delete connections[id];
        }
      });
      socket.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          if (connections[socketListId] === undefined) {
            this.setupRTCConnection(socketListId);
          }
        });
      });
    });
  };

  setupRTCConnection = (id) => {
    connections[id] = new RTCPeerConnection(peerConnectionConfig);
    connections[id].onicecandidate = (event) => {
      if (event.candidate) socket.emit("signal", id, JSON.stringify({ ice: event.candidate }));
    };
    connections[id].onaddstream = (event) => {
      let videoExists = document.getElementById(id);
      if (videoExists) {
        videoExists.srcObject = event.stream;
      } else {
        let main = document.getElementById("stream-main");
        let video = document.createElement("video");
        video.id = id;
        video.style.cssText = "width:32.5%; height:48%; object-fit:cover; margin:0.5%; border-radius:10px;";
        video.autoplay = true;
        video.srcObject = event.stream;
        main.appendChild(video);
      }
    };
    connections[id].addStream(window.localStream);
  };

  gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);
    if (fromId !== socketId) {
      if (signal.sdp) {
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          if (signal.sdp.type === "offer") {
            connections[fromId].createAnswer().then((description) => {
              connections[fromId].setLocalDescription(description).then(() => {
                socket.emit("signal", fromId, JSON.stringify({ sdp: connections[fromId].localDescription }));
              });
            });
          }
        });
      }
      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e) => console.log(e));
      }
    }
  };

  handleVideo = () => this.setState({ video: !this.state.video }, () => this.getUserMedia());
  handleAudio = () => this.setState({ audio: !this.state.audio }, () => this.getUserMedia());
  handleEndCall = () => {
    try {
      let tracks = this.localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/return-home";
  };
  handleChat = () => this.setState({ showModal: !this.state.showModal, newmessages: 0 });
  addMessage = (data, sender, id) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, { sender, data }],
      newmessages: id !== socketId ? prevState.newmessages + 1 : prevState.newmessages
    }));
  };
  sendMessage = () => {
    if (this.state.message !== "") {
      socket.emit("chat-message", this.state.message, this.props.user.name);
      this.setState({ message: "" });
    }
  };
  copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => message.success("Link copied!"));
  };
  connect = () => this.setState({ askForUsername: false }, () => this.getMedia());
  black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };
  silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  render() {
    return (
      <div className="Video-temp">
        {this.props.user && this.props.user._id ? (
          this.state.loadingEvent ? (
            <div className="Video-loading"><h1>Loading...</h1></div>
          ) : this.state.eventError ? (
            <div className="Video-error"><h1>Event Not Found</h1></div>
          ) : (
            <div className="Video">
              {this.state.askForUsername ? (
                <div className="connect-stream-main">
                   <p id="event-heading">{this.props.event.eventName}</p>
                   <button id="connect-button" onClick={this.connect}>Join Event</button>
                </div>
              ) : (
                <div className="connected-main">
                  <Row id="stream-main" className="flex-container">
                    <video id="my-video" ref={this.localVideoref} autoPlay muted></video>
                  </Row>
                  <div className="btn-down">
                    <button onClick={this.handleVideo}>{this.state.video ? <VideocamIcon/> : <VideocamOffIcon/>}</button>
                    <button onClick={this.handleAudio}>{this.state.audio ? <MicIcon/> : <MicOffIcon/>}</button>
                    <button onClick={this.handleEndCall} style={{color:"red"}}><CallEndIcon/></button>
                    <button onClick={this.handleChat}><ChatIcon/></button>
                    <button onClick={this.copyUrl}><ContentCopyIcon/></button>
                  </div>
                </div>
              )}
            </div>
          )
        ) : <UserNotFound />}
      </div>
    );
  }
}
export default Video;

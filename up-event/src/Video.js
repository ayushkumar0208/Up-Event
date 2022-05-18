import React, { Component } from "react";
import io from "socket.io-client";
import { Badge } from "@material-ui/core";
import Messenger from "./Components/Pages/Messenger/Messenger";
import VideocamIcon from "@material-ui/icons/Videocam";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@material-ui/icons/Send";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import CallEndIcon from "@material-ui/icons/CallEnd";
import ChatIcon from "@material-ui/icons/Chat";
import { message } from "antd";
import "antd/dist/antd.css";
import { Row } from "reactstrap";
import "./Video.css";
import axios from "axios";
import ReactScrollableFeed from "react-scrollable-feed";
import UserNotFound from "./Components/Pages/ErrorPages/UserNotFound";

const server_url = "http://localhost:4001";

var connections = {};
const peerConnectionConfig = {
  iceServers: [
    // { 'urls': 'stun:stun.services.mozilla.com' },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};
var socket = null;
var socketId = null;
var elms = 0;

class Video extends Component {
  localVideoref = React.createRef();
  videoAvailable = false;
  audioAvailable = false;

  state = {
    video: true,
    audio: true,
    screen: false,
    showModal: false,
    showPanel: false,
    showEnd:true,
    screenAvailable: false,
    messages: [],
    message: "",
    newmessages: 0,
    askForUsername: true,
    username: this.props.user.name,
    eventId: [],
    participants:[]
  };
  connections = {};

  componentDidMount() {
    this.getPermissions();
    
    
  }

  
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
            this.localVideoref.current.srcObject = stream;
          })
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };

  getMedia = () => {
    this.setState(
      {
        video: this.videoAvailable,
        audio: this.audioAvailable,
      },
      () => {
        this.getUserMedia();
        this.connectToSocketServer();
      }
    );
  };

  getUserMedia = () => {
    if (
      (this.state.video && this.videoAvailable) ||
      (this.state.audio && this.audioAvailable)
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: this.state.video, audio: this.state.audio })
        .then(this.getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = this.localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    this.localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketId) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          this.setState(
            {
              video: false,
              audio: false,
            },
            () => {
              try {
                let tracks = this.localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
              } catch (e) {
                console.log(e);
              }

              let blackSilence = (...args) =>
                new MediaStream([this.black(...args), this.silence()]);
              window.localStream = blackSilence();
              this.localVideoref.current.srcObject = window.localStream;

              for (let id in connections) {
                connections[id].addStream(window.localStream);

                connections[id].createOffer().then((description) => {
                  connections[id]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        id,
                        JSON.stringify({
                          sdp: connections[id].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                });
              }
            }
          );
        })
    );
  };

  getDislayMedia = () => {
    if (this.state.screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(this.getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    this.localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketId) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          this.setState(
            {
              screen: false,
            },
            () => {
              try {
                let tracks = this.localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
              } catch (e) {
                console.log(e);
              }

              let blackSilence = (...args) =>
                new MediaStream([this.black(...args), this.silence()]);
              window.localStream = blackSilence();
              this.localVideoref.current.srcObject = window.localStream;

              this.getUserMedia();
            }
          );
        })
    );
  };

  gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketId) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  changeCssVideos = (main) => {
    let widthMain = main.offsetWidth;
    let minWidth = "30%";
    if ((widthMain * 30) / 100 < 300) {
      minWidth = "250px";
    }
    let minHeight = "200px";

    let height = String(100 / elms) + "%";
    let width = "";
    if (elms === 0 || elms === 1) {
      width = "100%";
      height = "100%";
    } else if (elms === 2) {
      width = "48%";
      height = "95%";
    } else if (elms === 3 || elms === 4) {
      width = "32.5%";
      height = "48%";
    } else {
      width = "32.5%";
      height = "48%";
    }

    let videos = main.querySelectorAll("video");
    for (let a = 0; a < videos.length; ++a) {
      videos[a].style.minWidth = minWidth;
      videos[a].style.minHeight = minHeight;
      videos[a].style.setProperty("width", width);
      videos[a].style.setProperty("height", height);
    }

    return { minWidth, minHeight, width, height };
  };

  connectToSocketServer = () => {
    socket = io.connect(server_url, { secure: true });

    socket.on("signal", this.gotMessageFromServer);

    socket.on("connect", () => {
      socket.emit("join-call", window.location.href);
      socketId = socket.id;

      socket.on("chat-message", this.addMessage);

      socket.on("user-left", (id) => {
        let video = document.querySelector(`[data-socket="${id}"]`);
        if (video !== null) {
          elms--;
          video.parentNode.removeChild(video);

          let main = document.getElementById("stream-main");
          this.changeCssVideos(main);
        }
      });

      socket.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConnectionConfig
          );
          // Wait for their ice candidate
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socket.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Wait for their video stream
          connections[socketListId].onaddstream = (event) => {
            // TODO mute button, full screen button
            var searchVidep = document.querySelector(
              `[data-socket="${socketListId}"]`
            );
            if (searchVidep !== null) {
              // if i don't do this check it make an empyt square
              searchVidep.srcObject = event.stream;
            } else {
              elms = clients.length;
              let main = document.getElementById("stream-main");
              let cssMesure = this.changeCssVideos(main);

              let video = document.createElement("video");

              let css = {
                minWidth: cssMesure.minWidth,
                minHeight: cssMesure.minHeight,
                maxHeight: "95%",
                margin: "0.25vw",
                border: "2px solid rgb(45, 45, 45)",
                objectFit: "fill",
              };
              for (let i in css) video.style[i] = css[i];

              video.style.setProperty("width", cssMesure.width);
              video.style.setProperty("height", cssMesure.height);
              video.setAttribute("data-socket", socketListId);
              video.srcObject = event.stream;
              video.autoplay = true;
              video.playsinline = true;

              main.appendChild(video);
            }
          };

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([this.black(...args), this.silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketId) {
          for (let id2 in connections) {
            if (id2 === socketId) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socket.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  handleVideo = () =>
    this.setState({ video: !this.state.video }, () => this.getUserMedia());
  handleAudio = () =>
    this.setState({ audio: !this.state.audio }, () => this.getUserMedia());
  handleScreen = () =>
    this.setState({ screen: !this.state.screen }, () => this.getDislayMedia());

  handleEndCall = () => {
    try {
      let tracks = this.localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    this.props.setLink({});
    // this.props.setEventInfo({});
    
    window.location.href = "/return-home";
  };

  handleChat = () => {
    if (!this.state.showModal) {
      this.setState({ showModal: true });
      if (this.state.newmessages !== 0) {
        this.setState({ newmessages: 0 });
      }
    } else {
      this.setState({ showModal: false, newmessages: 0 });
    }
    console.log(this.state.participants)
    console.log(this.props.Link);
  };
  openChat = () => this.setState({ showModal: true, newmessages: 0 });
  closeChat = () => this.setState({ showModal: false });
  handleMessage = (e) => this.setState({ message: e.target.value });

  addMessage = (data, sender, socketIdSender) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, { sender: sender, data: data }],
    }));
    if (socketIdSender !== socketId) {
      this.setState({ newmessages: this.state.newmessages + 1 });
    }
  };

  handleUsername = (e) => this.setState({ username: e.target.value });

  sendMessage = () => {
    if (this.state.message === "") {
      alert("Please Enter Message");
    } else {
      socket.emit("chat-message", this.state.message, this.props.user.name);
      this.setState({ message: "", sender: this.props.user.name });
    }
  };

  copyUrl = () => {
    let text = window.location.href;
    if (!navigator.clipboard) {
      let textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");

        message.success("Link copied to clipboard!");
      } catch (err) {
        message.error("Failed to copy");
      }
      document.body.removeChild(textArea);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        message.success("Link copied to clipboard!");
      },
      () => {
        message.error("Failed to copy");
      }
    );
  };

  connect = () => {
    this.setState(
      { askForUsername: false, panelist: this.props.Link.data },
      () => this.getMedia()
    );
  };

  isChrome = function () {
    let userAgent = (navigator && (navigator.userAgent || "")).toLowerCase();
    let vendor = (navigator && (navigator.vendor || "")).toLowerCase();
    let matchChrome = /google inc/.test(vendor)
      ? userAgent.match(/(?:chrome|crios)\/(\d+)/)
      : null;
    // let matchFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/)
    // return matchChrome !== null || matchFirefox !== null
    return matchChrome !== null;
  };

  toggleChatBox = () => {
    var x = document.getElementById("connected-chat");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };

  togglePanelChat = () =>{
    this.setState({ showPanel: !this.state.showPanel })
    fetch("http://localhost:8800/getParticipants").then(response=> response.json()).then(result=>{
        this.setState({
          participants:result
        })
      })
      const eventId = this.props.event.eventId;
      var panelists= [];
      this.state.participants.forEach((par) => {
        const host = par.joinCode.split("-")
        if(par.eventId===eventId && par.hostCode===host[1]){
          panelists.push(par)
        }
      })
      console.log(panelists)
      const length = panelists.length
      for(var i=0;i<length;i++){
        const curr = panelists[i];
        for(var j=i+1;j<length;j++){
          const currFriend = panelists[j];
          axios.post("http://localhost:8800/api/conversations",{
            senderId:curr.userId,
            receiverId:currFriend.userId
          }).then((res) => {
            console.log("Conversation Added Successfully!");
          });
        }
      }
  }

  endEvent = () => {
    const ID = this.props.event._id;
    var api = "http://localhost:8800/deleteEvent/" + ID;
    console.log(api);
    console.log(this.props.event);
    axios.delete(api);
    this.setState({showEnd:false})
  };
 
  // endEvent = (e) => {
  //   axios.get("http://localhost:9002/onGoingEvent").then(result=>{
  //     this.setState({eventId:result})
  //   })
  //   console.log(this.state.eventId.data)
  //   this.state.eventId.data.forEach(val => {
  //     console.log(val.eventId)
  //     if(val.eventId==="73b2h2v6qbh"){
  //       var id = val._id;
  //       console.log(id);
  //       axios.delete(`http://localhost:9002/delete/${id}`);
  //     }
  //   })

  // }

  render() {
    if (this.isChrome() === false) {
      return (
        <div>
          <h1>Sorry, this works only with Google Chrome</h1>
        </div>
      );
    }
    return (
      <div className="Video-temp">
        {this.props.user &&
        this.props.user._id &&
        this.props.event ? (
          <div className="Video">
            {this.state.askForUsername === true ? (
              <div className="connect-stream-main">
                <div style={{ background: "#FDFDFC" }}>
                  <p id="event-heading">{this.props.event.eventName}</p>
                  <p id="event-orgBy">
                    Organized By : {this.props.event.orgBy}
                  </p>
                  <p id="event-desc">{this.props.event.desc}</p>
                </div>
                <div className="event-container-2">
                  {console.log(this.props.user.name)}

                  <div style={{ backgroundColor: "transparent" }}>
                    <img
                      id="connect-stream-img"
                      src="/JoinEventImages/JoinEvent.gif"
                      alt=""
                    />
                  </div>
                  <p id="event-user">Joining as {this.props.user.name}</p>
                  {this.props.user.email===this.props.event.createdBy?(
                    <p id="event-user">Host Code : {this.props.event.hostCode}</p>
                  ):(null)}
                  
                  <div className="connect-btn-down">
                    <button
                      id="connect-button"
                      variant="contained"
                      color="primary"
                      onClick={this.connect}
                    >
                      Join Event
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="connected-main">
                <div className="connected">
                  <div className="video-container">
                    <div className="link-copy-container">
                      <div
                        style={{
                          height: "10vh",
                          backgroundColor: "rgb(66, 65, 65)",
                        }}
                      >
                        <p id="Event-heading">{this.props.event.eventName}</p>
                        <p id="Event-orgBy">
                          Organized By: {this.props.event.orgBy}
                        </p>
                      </div>
                    </div>
                    <div className="stream-container">
                      <Row id="stream-main" className="flex-container">
                        <video
                          id="my-video"
                          ref={this.localVideoref}
                          autoPlay
                          muted
                        ></video>
                      </Row>
                      {/* <p>{this.props.user.name}</p> */}
                    </div>
                  </div>
                  <div className="btn-down">
                    <button
                      className="stream-options"
                      style={{ color: "#424242", background: "tranparent" }}
                      onClick={this.handleVideo}
                    >
                      {this.state.video === true ? (
                        <VideocamIcon />
                      ) : (
                        <VideocamOffIcon />
                      )}
                    </button>

                    <button
                      className="stream-options"
                      style={{ color: "#f44336" }}
                      onClick={this.handleEndCall}
                    >
                      <CallEndIcon />
                    </button>

                    <button
                      className="stream-options"
                      style={{ color: "#424242" }}
                      onClick={this.handleAudio}
                    >
                      {this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
                    </button>

                    {this.props.Link.data &&
                    this.props.Link.data.length > 1 ? (
                      <button
                        className="stream-options"
                        onClick={this.togglePanelChat}
                      >
                        <ChatBubbleOutlineIcon />
                      </button>
                    ) : null}

                    {this.props.Link.data &&
                    this.props.Link.data.length > 1 &&
                    this.state.screenAvailable === true ? (
                      <button
                        className="stream-options"
                        style={{ color: "#424242" }}
                        onClick={this.handleScreen}
                      >
                        {this.state.screen === true ? (
                          <ScreenShareIcon />
                        ) : (
                          <StopScreenShareIcon />
                        )}
                      </button>
                    ) : null}

                    <Badge
                      badgeContent={this.state.newmessages}
                      max={999}
                      id="temp"
                      color="secondary"
                      // onClick={this.handleChat}
                    >
                      <button
                        className="stream-options"
                        style={{ color: "#424242" }}
                        onClick={this.handleChat}
                      >
                        <ChatIcon />
                      </button>
                    </Badge>
                    {this.props.Link.data &&
                    this.props.Link.data.length > 1 &&
                    this.state.screenAvailable === true ? (
                      <button id="copy-button" onClick={this.copyUrl}>
                        <ContentCopyIcon />
                      </button>
                    ) : null}
                    {this.props.Link.data &&
                    this.props.Link.data.length > 1 &&
                    this.props.user.email === this.props.event.createdBy && this.state.showEnd? (
                      <button
                        className="stream-options"
                        onClick={this.endEvent}
                      >
                        End
                      </button>
                    ) : null}
                  </div>
                </div>
                {this.state.showPanel &&
                this.props.Link.data &&
                this.props.Link.data.length > 1 ? (
                  <div style={{ background: "transparent", margin: "auto" }}>
                    <Messenger />
                  </div>
                ) : null}

                {this.state.showModal ? (
                  <div className="connected-chat">
                    <p id="chat-title">Chat</p>

                    <div className="chat-message-section">
                      <ReactScrollableFeed className="scrollable-feed">
                        {this.state.messages.length > 0 ? (
                          this.state.messages.map((item, index) => (
                            <div className="remaining" key={index}>
                              <div className="messages" id="mess-content">
                                <b className="chat-user">{item.sender}</b>
                                <p className="chat-message">{item.data}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p
                            style={{
                              textAlign: "center",
                              color: "white",
                              backgroundColor: "transparent",
                              fontSize: "0.9vw",
                            }}
                          >
                            No message yet
                          </p>
                        )}
                      </ReactScrollableFeed>
                    </div>

                    <div className="chat-input-container">
                      <input
                        id="chat-input"
                        placeholder="Message"
                        value={this.state.message}
                        onChange={(e) => this.handleMessage(e)}
                      />
                      <button
                        id="chat-send-button"
                        variant="contained"
                        color="primary"
                        onClick={this.sendMessage}
                      >
                        <SendIcon />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : (
          <div>
            <UserNotFound />
          </div>
        )}
      </div>
    );
  }
}

export default Video;

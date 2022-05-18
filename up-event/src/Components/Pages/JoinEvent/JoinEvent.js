import React from "react";
import "./JoinEvent.css";
import NavMenu from "../../NavBar/NavMenu";
import UserNotFound from "../ErrorPages/UserNotFound";
import axios from 'axios'

class JoinEvent extends React.Component {

  state = {
    url: "",
    activeEvents:[],
  };

  componentDidMount(){
    fetch("http://localhost:8800/onGoingEvent").then(response=> response.json()).then(result=>{
        this.setState({
          activeEvents:result
        })
      })
  }

  

  handleChange = (e) => this.setState({ url: e.target.value });

  // join = () => {
  //   if (this.state.url !== "") {
  //     var url = this.state.url.split("/");
  //     window.open(
  //       `/${url[url.length - 1]}`,
  //       '_blank' // <- This is what makes it open in a new window.
  //     );
  //   } else {
  //     var url = Math.random().toString(36).substring(2, 17);
  //     window.open(
  //       `/${url}`,
  //       '_blank' // <- This is what makes it open in a new window.
  //     );
  //   }
  // };

  // join = () => {
  //   var url = this.state.url.split("/");
  //   console.log(url[url.length - 1]);
  //   eventDB.findOne({ eventId: url[url.length - 1] }, (err, idExist) => {
  //     if (idExist) {

  //       window.open(
  //         `/${url[url.length - 1]}`,
  //         "_blank" // <- This is what makes it open in a new window.
  //       );
  //     } else {
  //       console.log("found")
  //       alert("Wrong Event Code");
  //     }
  //   });
  // };

  

  join = () => {
      var url = this.state.url.split("-");
      var value = "";
      if(url.length>1){
        this.state.activeEvents.forEach(function(e){
          console.log(e._id)
          if(url[1].toString().localeCompare(e.hostCode)===0){
            value=url[url.length-1]
          }
        })
        
      }
      this.props.setLink({data:value});
      var found = false;
      var currentEvent = {}
      console.log(this.state.activeEvents);
      this.state.activeEvents.forEach(function(ev){
        if(url[0].toString().localeCompare(ev.eventId)===0){
          found=true;
          currentEvent=ev;
        }
      })
      this.props.setEventInfo(currentEvent)

      axios.post("http://localhost:8800/participant",{
        eventId:currentEvent.eventId,
        hostCode:currentEvent.hostCode,
        joinCode:url[0]+"-"+value,
        email:this.props.user.email,
        userId:this.props.user._id 
      }).then((res)=>{
        console.log("Added Participant");
      }).catch((err)=>{
        console.log(err);
      })



      if(found){
        window.open(
          `/event/${url[0]}`,
          "_blank" // <- This is what makes it open in a new window.
        );
      }else{
        alert("Wrong Event Code")
      } 
  };
  render() {
    return (
      <div className="join-event">
        {this.props.user && this.props.user._id ? (
          <div>
            <NavMenu
              user={this.props.user}
              setLoginUser={this.props.setLoginUser}
            />
            <div className="event-container">
              <div className="event-text-container">
                {/* <p className="event-content">
            Video conference website that lets you stay in touch with all your
            friends.
          </p> */}
                <img
                  id="event-join-img"
                  src="/JoinEventImages/JoinEvent2.gif"
                  alt=""
                />
              </div>

              <div className="event-join-container">
                <h1 className="event-heading">
                  Join Event from Anywhere simply with a Event Code.
                </h1>
                <p className="event-content2">Join Event</p>
                <input
                  id="event-url-input"
                  placeholder="Enter Event Code"
                  onChange={(e) => this.handleChange(e)}
                />
                <button id="event-join-button" onClick={this.join}>
                  Join
                </button>
              </div>
            </div>
          </div>
        ) : (
          <UserNotFound />
        )}
      </div>
    );
  }
}

export default JoinEvent;

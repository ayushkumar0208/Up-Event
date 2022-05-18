import React, { useState, useLayoutEffect, useEffect } from "react";
import "./CreateEvent.css";
import axios from "axios";
import NavMenu from "../../NavBar/NavMenu";
import UserNotFound from "../ErrorPages/UserNotFound";

function CreateEvent(props) {
  useEffect(() => {
    function fetchData() {
      fetch("http://localhost:8800/onGoingEvent")
        .then((response) => response.json())
        .then((data) => {
          array.push(...array);
          array.push(data);
        });
      // console.log(req.data);
      // setNewEvent(req.data);
      // newEvent.map((event) => {
      //   console.log(event.eventId)
      //   props.setActiveEvents(event.eventId)
      // })
    }
    fetchData();
  });
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  var array = [];

  const [event, setEvent] = useState({
    _id:"",
    eventName: "",
    orgBy: "",
    desc: "",
    createdBy:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
      createdBy:props.user.email,
    });
    // setEvent({
    //   ...event,
    //   createdBy:props.user.email
    // })
  };

  const join = () => {
    
    var url = Math.random().toString(36).substring(2, 12);
    var code = Math.random().toString(36).substring(2, 7);
    props.setLink({data:code})
    // eventDB.findOne({eventId:url})
    const Obj = {
      eventName:event.eventName,
      orgBy:event.orgBy,
      desc:event.desc,
      eventId:url,
      createdBy:props.user.email,
      hostCode:code
    }
    axios
      .post("http://localhost:8800/onGoingEvent", Obj)
      .then((res) => {
        console.log("Got Data");
        console.log(array);
      });
      
      props.setEventInfo(Obj);
      
    window.open(
      `/event/${url}`,
      "_blank" // <- This is what makes it open in a new window.
    );
  };

  return (
    <div className="create-event">
      {props.user && props.user._id?(
        <div>
          <NavMenu user={props.user} setLoginUser={props.setLoginUser} />
      <div className="create-event-main">
        <img
          id="create-event-img"
          src="/CreateEventImages/CreateEvent.gif"
          alt=""
        />
        <div className="create-form">
          <p id="create-form-heading">Create An Event</p>
          <input
            id="event-name"
            type="text"
            name="eventName"
            value={event.eventName}
            placeholder="Enter Event Name"
            onChange={handleChange}
          />
          <input
            id="event-org"
            type="text"
            name="orgBy"
            value={event.orgBy}
            placeholder="Organized By"
            onChange={handleChange}
          />
          <textarea
            name="desc"
            value={event.desc}
            id="event-description"
            cols="25"
            rows="10"
            placeholder="Enter Event Description"
            onChange={handleChange}
          ></textarea>
          <button id="create-button" onClick={join}>
            Create
          </button>
        </div>
      </div>
        </div>
      ):(<UserNotFound/>)}
      
    </div>
  );
}

export default CreateEvent;

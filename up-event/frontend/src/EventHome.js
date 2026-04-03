import React from "react";
import "./EventHome.css"
import { Link } from "react-router-dom";

function EventHome() {
  return (
    <div className="event-home">
      <div className="ehome-container">
        <div className="ehome-text-container">
          <h1 className="ehome-heading">Host Your Own Event</h1>
          <p className="ehome-content">
            We let you stay in touch with all your
            friends.
          </p>
        </div>

        <div className="ehome-join-container">
          <img id="ehome-join-img" src="/EventHomePage/EventHome.gif" alt="" />          
          <Link className="option" to="/create-event">
          <button id="ehome-join-button" >
            Create an Event
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventHome;

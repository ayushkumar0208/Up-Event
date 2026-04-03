import React, { useLayoutEffect } from "react";
import "./Features.css";
import NavMenu from "../NavBar/NavMenu";
import FooterBar from "../Footer/FooterBar";

function Features(props) {
  // Making the page to always open at top using useLayoutEffect
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <div className="features">
      <NavMenu user={props.user} setLoginUser={props.setLoginUser} />
      <div className="features-container1">
        <div className="features-text">
          <p className="features-title">
            Host Stunning Events from your Personalised Virtual Venue
          </p>
          <p className="features-content">
            Virtual Events Hosting offers fully branded and secure alternatives
            to standard conferencing and live-stream platforms. Provide a highly
            customisable stage for your live stream. Everything required to run
            a live stream built-in including HD (up to 4k) video player,
            production capabilities, live chat, polls and custom widgets for
            data collection.
          </p>
        </div>
        <div className="features-image-container">
          <img id="features-img" src="/FeaturesImages/Feature1.gif" alt="" />
        </div>
      </div>
      <div className="features-container2">
        
        <div className="features-image-container">
          <img id="features-img" src="/FeaturesImages/Feature4.gif" alt="" />
        </div>
        <div className="features-text">
          <p className="features-title">
          Smart, flexible, and powerful event registration system
          </p>
          <p className="features-content">
            <ul>
              <li>A smarter way to register</li>
              <li>Registration with the power to flex</li>
              <li>Powerful enough for your most complex events</li>
              <li>Increase productivity</li>
            </ul>
          </p>
        </div>
      </div>
      <FooterBar/>
    </div>
  );
}

export default Features;

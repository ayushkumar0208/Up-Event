import React from "react";
import "./FooterBar.css";
import {  Link } from "react-router-dom";

function FooterBar() {
  // console.log(this.props.user)
  return (
    <div className="footerBar">
      <div className="footer-main">
        <div className="footer-heading">
          <img
            id="footer-logo"
            src="https://www.pngkey.com/png/full/352-3520852_restaurant-logo-design-png.png"
            alt=""
          />
          <p className="site-name">UpEvent</p>
        </div>
        <div className="line"></div>
        <div className="footer-options">
          <div className="footer-option1">
            <p className="footer-option-heading">Quick Links</p>
            <Link className="footer-option" to="/">
              Home
            </Link>
            <Link className="footer-option" to="/features">
              Features
            </Link>
            {/* {this.props.name? (
              <Link className="footer-option" to="/log-in">
                LogIn/SignUp
              </Link>
            ) : (
              <div>

              </div>
            )} */}
          </div>
          <div className="footer-option2">
            <p className="footer-option-heading">Virtual Events</p>
            <Link className="footer-option" to="/create-event">
              Create Event
            </Link>
            <Link className="footer-option" to="/join-event">
              Join Event
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-img">
        <img id="footer-image" src="/FooterImages/FooterBar.png" alt="" />
      </div>
    </div>
  );
}

export default FooterBar;

import React, { Component } from "react";
import "./NavMenu.css";
import { Link } from "react-router-dom";

class NavMenuBar extends Component {
  state = {
    changeColor: false,
  };

  logout = (e) => {
    e.preventDefault();
    this.props.setLoginUser({});
  };

  colorHandler = (e) => {
    e.preventDefault();
    if (window.scrollY > 100) {
      this.setState({ changeColor: true });
    } else {
      this.setState({ changeColor: false });
    }
  };
  render() {
    window.addEventListener("scroll", this.colorHandler);
    return (
      // <Router>
      <div
        className={this.state.changeColor ? "NavMenu NavMenu-bg" : "NavMenu"}
      >
        {window.addEventListener("scroll", this.colorHandler)}
        <div className="logo">
          <img
            id="logo-image"
            src="https://www.pngkey.com/png/full/352-3520852_restaurant-logo-design-png.png"
            alt=""
          />
        </div>
        <div className="options">
          <Link className="option" to="/">
            Home
          </Link>
          <Link className="option" to="/features">
            Features
          </Link>
          {this.props.user && this.props.user._id ? (
            <div id="after-login-options">
              <Link className="option" to="/create-event">
                Host Event
              </Link>
              <Link className="option" to="/join-event">
                Join Event
              </Link>
              <div className="Navbar-logout">
                <p id="navbar-username">{this.props.user.name}</p>
                <div className="logout-button" onClick={this.logout}>
                  Logout
                </div>
              </div>
            </div>
          ) : (
            <Link className="option login-option" to="/log-in">
              LogIn/SignUp
            </Link>
          )}
        </div>
      </div>
      // </Router>
    );
  }
}

export default NavMenuBar;

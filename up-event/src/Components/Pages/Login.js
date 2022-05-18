import React, { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavMenu from "../NavBar/NavMenu";
// const bcrypt = require("bcrypt");
// import bcrypt from 'bcrypt'
var encode = require("hashcode").hashCode;

function Login(props) {
  const navigate = useNavigate();

  // Making the page to always open at top using useLayoutEffect
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  async function login(e) {
    var found = false;
    // const salt = await bcrypt.genSalt(10);

    fetch("http://localhost:8800/allusers")
      .then((response) => response.json())
      .then((result) => {
        result.forEach(function (ev) {
          if (ev.email.localeCompare(user.email) === 0) {
            found = true;
            if (ev.password.localeCompare(user.password) === 0) {
              axios.post("http://localhost:8800/login", user).then((res) => {
                props.setLoginUser(res.data.user);
 
                navigate("/");
              });
            } else {
              alert("Invalid Credentials");
            }
          }
        });
        if (found === false) {
          alert("User not found");
        }
      });
  }

  return (
    <div className="login">
      <NavMenu user={props.user} setLoginUser={props.setLoginUser} />
      <div className="login-main-container">
        <div className="login-img-container">
          <img id="login-img" src="/LoginPageImages/Login.png" alt="" />
        </div>
        <div className="login-main">
          <div className="login-container">
            <p className="login-heading">Login</p>
            <div className="login-text-fields">
              <input
                className="login-entry"
                type="text"
                name="email"
                value={user.email}
                placeholder="Username/Email"
                onChange={handleChange}
              />
              <input
                className="login-entry"
                type="password"
                name="password"
                value={user.password}
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
            <div className="login-button" onClick={login}>
              Login
            </div>
            <Link className="login-new-register" to="/register">
              New User? Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

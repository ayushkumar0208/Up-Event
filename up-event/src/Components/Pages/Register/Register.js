import React, { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavMenu from "../../NavBar/NavMenu";

function Register(props) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const registerUser = () => {
    const { name, email, password, reEnterPassword } = user;
    if (name && email && password && password === reEnterPassword) {
      axios.post("http://localhost:8800/register", user).then((res) => {
        navigate("/log-in");
      });
    } else {
      alert("invalid ");
    }
  };

  return (
    <div className="register">
      <NavMenu user={props.user} setLoginUser={props.setLoginUser} />
      <div className="register-main-container">
        <div className="register-main">
          <div className="register-heading">Register</div>
          <div className="register-text-fields">
            <input
              className="register-entry"
              name="name"
              value={user.name}
              type="text"
              placeholder="Enter Name"
              onChange={handleChange}
            />
            <input
              className="register-entry"
              name="email"
              value={user.email}
              type="text"
              placeholder="Enter Email"
              onChange={handleChange}
            />
            <input
              className="register-entry"
              name="password"
              value={user.password}
              type="password"
              placeholder="Enter Password"
              onChange={handleChange}
            />
            <input
              className="register-entry"
              name="reEnterPassword"
              value={user.reEnterPassword}
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
          </div>
          <div className="register-button" onClick={registerUser}>
            Submit
          </div>
          <Link className="register-already-user" to="/log-in">
            Already have an Account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

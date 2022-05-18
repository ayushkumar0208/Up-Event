import React, { useState, useEffect } from "react";
import Video from "./Video";
import Messenger from "./Components/Pages/Messenger/Messenger"
import Features from "./Components/Pages/Features";
import Home from "./Components/Pages/Home";
import Thank from "./Components/Pages/Thank/Thank"
import Login from "./Components/Pages/Login";
import Premium from "./Components/Pages/Premium";
import CreateEvent from "./Components/Pages/CreateEvent/CreateEvent";
import JoinEvent from "./Components/Pages/JoinEvent/JoinEvent";
import Register from "./Components/Pages/Register/Register";
import Error404 from "./Components/Pages/ErrorPages/Error404"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  const [user, setLoginUser] = useState({});
  const [event,setEventInfo] = useState({});
  const [Link,setLink] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("User");
    const data2 = localStorage.getItem("Event")
    const data3 = localStorage.getItem("Code")
    setLoginUser(JSON.parse(data));
    setEventInfo(JSON.parse(data2))
    setLink(JSON.parse(data3))
  }, []);
  useEffect(() => {
    localStorage.setItem("User", JSON.stringify(user));
    localStorage.setItem("Event", JSON.stringify(event));
    localStorage.setItem("Code", JSON.stringify(Link));
    // console.log(Link);
  });
  return (
    <Router>
      <div>
        <Routes>
          <Route
            exact
            path="/"
            element={<Home user={user} setLoginUser={setLoginUser} />}
          />
          <Route
            path="/features"
            element={<Features user={user} setLoginUser={setLoginUser} />}
          />
          <Route
            path="/messenger"
            element={<Messenger/>}
          />
          <Route
            path="/create-event"
            element={<CreateEvent user={user} setLoginUser={setLoginUser} event={event} setEventInfo={setEventInfo} setLink={setLink}/>}
          />
          <Route
            path="/premium"
            element={<Premium user={user} setLoginUser={setLoginUser} />}
          />
          <Route path="/event/:url" element={<Video user={user} event={event} setEventInfo={setEventInfo} Link={Link} setLink={setLink}/>} />
          <Route
            path="/log-in"
            element={<Login user={user} setLoginUser={setLoginUser} />}
          />
          <Route
            path="/join-event"
            element={<JoinEvent user={user} setLoginUser={setLoginUser} Link={Link} setLink={setLink} event={event} setEventInfo={setEventInfo}/>}
          />
          <Route
            path="/register"
            element={<Register user={user} setLoginUser={setLoginUser} />}
          />
          <Route
            path="/return-home"
            element={<Thank user={user} event={event} setEventInfo={setEventInfo}/>}
          />
          <Route
            path="/page-not-found"
            element={<Error404/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

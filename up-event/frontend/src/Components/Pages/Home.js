import React, { useLayoutEffect } from "react";
import "./Home.css";
import EventHome from '../../EventHome'
import NavMenu from "../NavBar/NavMenu";
import FooterBar from "../Footer/FooterBar";

function Home(props) {
  // Making the page to always open at top using useLayoutEffect
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    
    <div className="Home">
      <NavMenu user={props.user} setLoginUser={props.setLoginUser} />
      <div className="home-container1">
        <div className="home-text">
          <p className="home-title">Virtual Event Hosting</p>
          <p className="home-content">
            We help you host a virtual exhibition, tradeshow, or career fair
            with our powerful webcast solutions and give a unique experience for
            your audience.
          </p>
        </div>
        <div className="home-image-container">
          <img id="home-img" src="/HomePageImages/Home_2.gif" alt="" />
        </div>
      </div>
      {props.user && props.user._id ?(
        <EventHome/>
        // null
      ):(
        <p></p>
      )}
      
      <div className="home-container2">
        <img id="home-img" src="/HomePageImages/Home_1.gif" alt="" />
        <div className="home-text">
          <p className="home-title">Executing the plan</p>
          <p className="home-content">
          We make sure that the virtual event is executed as planned and we update you regarding the progress and the outcome that can be expected in every step. Overall we ensure that the event takes place as planned.
          </p>
        </div>
      </div>
      <div className="home-container3">
        <div className="home-text">
          <p className="home-title">Developing a Strategy</p>
          <p className="home-content">
            We create a simple draft about what needs to be done so that
            everyone can follow the plan and set a timeline that is realistic
            and attainable. To ensure the work is on track we establish
            baselines or performance measures and the objectives, deliverables,
            and key milestones are clearly defined.
          </p>
        </div>

        <img
          id="home-img"
          className="image-3"
          src="/HomePageImages/Home_3.gif"
          alt=""
        />
      </div>
      <div>
        <p className="join-panel"></p>
      </div>
      <FooterBar/>
    </div>
  );
}

export default Home;

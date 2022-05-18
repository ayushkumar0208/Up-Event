import React, { useLayoutEffect } from "react";
import './Premium.css';
import NavMenu from "../NavBar/NavMenu";
import FooterBar from "../Footer/FooterBar";

function Premium(props) {
  // Making the page to always open at top using useLayoutEffect
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <div className="premium">
      <NavMenu user={props.user} setLoginUser={props.setLoginUser} />
      Premium
        <p>a</p>
        <p>a</p>
        
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <FooterBar/>
    </div>
  )
}

export default Premium
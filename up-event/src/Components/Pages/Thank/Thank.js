import React from 'react'
import "./Thank.css"
import Error404 from "../ErrorPages/Error404"

function Thank(props) {

function returnHome(){
  
  window.location.href = "/";
  props.setEventInfo({})
}

  return (
    <div className='thank'>
        {props.user && props.user._id && props.event?(
            <div className='thank-main'>
                <p id="thank-text">Thank's for joining {props.event.eventName}</p>
                <img id="thank-img" src='/Thanks/ReturHome.gif' alt=""/>
                <button id="return-home-button" onClick={returnHome}>Return to Home</button>
            </div>
        ):(<Error404/>)}
    </div>
  )
}
 
export default Thank
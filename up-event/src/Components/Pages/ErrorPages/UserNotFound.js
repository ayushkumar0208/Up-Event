import React from 'react'
import "./UserNotFound.css"
import { Link } from "react-router-dom";

function UserNotFound() {
  return (
    <div className='user_not_found'>
        
        <div className="user_not_found_text_container">
            <p id='user_not_found_text'>You Need To Login First</p>
            <Link id='user_not_found_button' to="/log-in">
              Return to Login Page
            </Link>
        </div>
        <div className="user_found_img_container">
            <img id="user_not_found_img" src="/NeedUser/NeedUser.gif" alt="" />
            
        </div>
    </div>
  )
}

export default UserNotFound
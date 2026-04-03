import React from 'react'
import "./Error404.css"

function Error404() {
  return (
    <div className='error-404'>
        <img id="error-404-img" src="/PageNotFound/Error404.gif" alt="" />
        <p id="error-404-text">Page Not Found</p>
    </div>
  )
}

export default Error404
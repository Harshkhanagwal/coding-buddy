import React from 'react'
import './style.css'


const Header = () => {
  return (
    <>
     <header className="header">
      {/* Left: Logo */}
      <div className="logo">
        <span className="logo-yellow">Coding</span> Buddy
      </div>

      {/* Right: Button */}
      <button className="header-btn">Login</button>
    </header>
    </>
  )
}

export default Header
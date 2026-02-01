import React from 'react'
import './style.css'
import { FaGithub } from "react-icons/fa6";


const Header = () => {
    return (
        <>
            <header className="header">
                {/* Left: Logo */}
                <div className="logo">
                    <span className="logo-yellow">Coding</span> Buddy
                </div>

                <a className='gitlogo' href="https://github.com/Harshkhanagwal/coding-buddy/tree/main" target='_blank'>
                    <FaGithub />
                </a>

            </header>
        </>
    )
}

export default Header
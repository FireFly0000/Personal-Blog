import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <Link to='/home'>
        <img className="logo"src={logo}/>
      </Link>
      <span><b>Thank You For Visiting My Blog And Leave A Beautiful Memory Here </b></span>
    </footer>
  )
}

export default Footer

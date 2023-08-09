import React, {useEffect, useState} from 'react'
import logo from '../assets/logo.png'
import {Link} from 'react-router-dom'
import { useAuth } from '../context/authContext'

const Navbar = () => {
  const {currentUser, logout} = useAuth()

  return (
    <div className='nav-bar'>
      <div className='container'>
        <div className='nav-logo'>
          <Link to="/home">
            <img className='logo' src={logo}/>
          </Link>  
        </div>
        <div className='nav-links-list'>
          <Link className='cat-link' to="/?cat=art"> 
            <h6>ART </h6>
          </Link>
          <Link className='cat-link' to="/?cat=cinema"> 
            <h6>CINEMA </h6>
          </Link>
          <Link className='cat-link' to="/?cat=traveling"> 
            <h6>TRAVELING</h6>
          </Link>
          <Link className='cat-link' to="/?cat=video_games"> 
            <h6>VIDEO GAMES </h6>
          </Link>
          <Link className='cat-link' to="/?cat=photography"> 
            <h6>PHOTOGRAPHY </h6>
          </Link>
          <Link className='cat-link' to="/?cat=music"> 
            <h6>MUSIC </h6>
          </Link>
          <Link className='cat-link' to="/?cat=food"> 
            <h6>FOOD</h6>
          </Link>
          <span>{currentUser?.username}</span>
          <Link className="link" to="/">
            <span className='write-btn' onClick={logout}>Logout</span>
          </Link>
          <span className='write-btn'>
            <Link className="link" to='/write'>Write</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar

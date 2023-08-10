import React from 'react'
import logo from '../assets/logo.png'
import {Link} from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const {currentUser, logout} = useAuth()

  const navigate = useNavigate()

  const toWrite = () =>{
    navigate("/write")
  }

  return (
    <div className='nav-bar'>
      <div className='container'>
        <div className='nav-logo'>
          <Link to="/home">
            <img className='logo' src={logo}/>
          </Link>  
        </div>
        <div className='nav-links-list'>
          <Link className='cat-link' to="/home/?cat=art"> 
            <h6>ART </h6>
          </Link>
          <Link className='cat-link' to="/home/?cat=cinema"> 
            <h6>CINEMA </h6>
          </Link>
          <Link className='cat-link' to="/home/?cat=traveling"> 
            <h6>TRAVELING</h6>
          </Link>
          <Link className='cat-link' to="/home/?cat=video_games"> 
            <h6>VIDEO GAMES </h6>
          </Link>
          <Link className='cat-link' to="/home/?cat=photography"> 
            <h6>PHOTOGRAPHY </h6>
          </Link>
          <Link className='cat-link' to="/home/?cat=music"> 
            <h6>MUSIC </h6>
          </Link>
          <Link className='cat-link' to="/home/?cat=food"> 
            <h6>FOOD</h6>
          </Link>
          <span>{currentUser?.username}</span>
          <Link className="link" to="/">
            <span className='write-btn' onClick={logout}>Logout</span>
          </Link>
          <span className='write-btn' onClick={toWrite}>Write</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar

import React from 'react'
import logo from '../assets/logo.png'
import {Link} from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import EmptyAvatar from '../assets/empty_avatar.jpg'

const Navbar = () => {
  const {currentUser, logout} = useAuth()

  const navigate = useNavigate()

  const toWrite = () =>{
    if(currentUser === null){
      navigate("/login")
    }  
    else  
      navigate("/write")
  }

  return (
    <div className='nav-bar'>
        <div className='nav-logo'>
          <Link to="/">
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
          { currentUser != null &&
            <Link className="link" to={`/profile/${currentUser.id}/${currentUser.username}`}>
              <img src={currentUser.img === null ? EmptyAvatar : currentUser.img} alt=''/>
              <span className='nav-user-name'>{currentUser.username}</span>
            </Link>
          }
          {
            currentUser != null?
            <Link className="link" to={'/'}> 
              <span className='write-btn' onClick={logout}>Logout</span>
            </Link> 
            : 
            <Link className="link" to="/login"> 
              <span className='write-btn'>Login</span>
            </Link>
          }
          <span className='write-btn' onClick={toWrite}>Write</span>
        </div>
    </div>
  )
}

export default Navbar

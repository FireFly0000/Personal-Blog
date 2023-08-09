import React, { ReactNode, useEffect, useState } from 'react'
import Edit from '../assets/edit.png'
import Delete from '../assets/delete.png'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Menu from '../components/Menu'
import axios from 'axios'
import { useAuth } from '../context/authContext'
import moment from 'moment'
import $ from 'jquery'

interface Post{
  id: number
  title: string
  descr: string
  img: string
  date: Date
  uid: number
  cat: string
  username: string
  userImg: string
}

const Single = () => {
  const [post, setPost] = useState<Post>()
  const location = useLocation()
  const navigate = useNavigate()

  const {currentUser} = useAuth()

  const postId = location.pathname.split("/")[2]

  useEffect(() =>{
    const fetchPosts = async () =>{
      try{
        const res = await axios.get(`/posts/${postId}`)
        await setPost(res.data)
      }
      catch(err){
        console.log(err)
      }
    }
    fetchPosts()
  }, [postId]);

  const deleteHandler = async () =>{
    try{
      const res = await axios.delete(`/posts/${postId}`, {withCredentials: true})
      navigate("/")
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <div className='container'> 
      <div className='single-page'>
        <div className="content">
          <base href="http://localhost:5173/"/>
            <img className='post-img' src={`src/assets/uploads/${post?.img}`}/>
          <div className="user">
            {post?.userImg && <img src={post?.userImg}/>}
            <div className="info">
              <span>{post?.username}</span>
              <p>{moment(post?.date).fromNow()}</p>
            </div>
            {
            currentUser.username === post?.username && 
              <div className="btn-modify">
                <Link to={`/write?edit=2`} state={post}>
                  <img src={Edit} alt=''/>
                </Link>  
                <img onClick={deleteHandler} src={Delete} alt=''/>
              </div>
            }
          </div>
          <h1>{post?.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post?.descr as string }}></div>
        </div>
        <Menu single_post_id = {post?.id} cat={post?.cat}/>
      </div>
    </div> 
  )
}

export default Single

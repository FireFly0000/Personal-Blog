import {useEffect, useState } from 'react'
import Delete from '../assets/delete.png'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Menu from '../components/Menu'
import axios from 'axios'
import { useAuth } from '../context/authContext'
import moment from 'moment'
import EmptyAvatar from '../assets/empty_avatar.jpg'
import ImgDelete from '../components/ImgDelete'

interface Post{
  id: number
  title: string
  descr: string
  img: string
  date: Date
  uid: number
  cat: string
  username: string
  userimg: string
}

const Single = () => {
  const [post, setPost] = useState<Post>()
  const location = useLocation()
  const navigate = useNavigate()

  const {currentUser, access_token} = useAuth()

  const postId = location.pathname.split("/")[2]

  useEffect(() =>{
    const fetchPost = async () =>{
      try{
        const res = await axios.get(`/posts/${postId}`)
        await setPost(res.data)
      }
      catch(err){
        console.log(err)
      }
    }
    fetchPost()
  }, [postId]);

  const deleteHandler = async () =>{
    try{
      await ImgDelete(post?.img)
      const res = await axios.post(`/posts/delete/${postId}`, {access_token: access_token}, {withCredentials: true})
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
          <img className='post-img' src={post?.img}/>
          <div className="user">
            <Link className="link" to={`/profile/${post?.uid}`}>
            <img src={post?.userimg === null ? EmptyAvatar : post?.userimg}/>
            </Link>
            <div className="info">
            <Link className="link" to={`/profile/${post?.uid}/${post?.username}`}>  
              <span>{post?.username}</span>
            </Link>
              <p>{moment(post?.date).fromNow()}</p>
            </div>
            {
            currentUser != null && currentUser.username === post?.username && 
              <div className="btn-modify">
                <Link to={`/write`} state={post}>
                  <img src={'https://res.cloudinary.com/dkv4gihl5/image/upload/v1691772181/edit_hpith0.png'} alt=''/>
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

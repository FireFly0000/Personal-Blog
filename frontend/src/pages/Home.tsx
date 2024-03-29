import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'

interface Post{
  id: number
  title: string
  descr: string
  img: string
  date: Date
  uid: number
  cat: string
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([])
  
  const cat = useLocation().search
  const navigate  = useNavigate()

  useEffect(() =>{
    const fetchPosts = async () =>{
      try{
        const res = await axios.get(`/posts${cat}`)
        setPosts(res.data)
      }
      catch(err){
        console.log(err)
      }
    }
    fetchPosts()
  }, [cat])

  const clickHandler = (pid: number) =>{
    return (event: React.MouseEvent) =>{
      event.preventDefault()
      navigate(`/post/${pid}`)
    }
  }

  return (
    <div className='container'>
      <div className='home-page'>
        <div className="posts">
          {posts.map( post =>(
            <div className="post" key={post.id}>
              <div className="img-container">
                <img src={post.img} alt=""/>
              </div>
              <div className="content">
                <Link className='link' to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                </Link>
                <div dangerouslySetInnerHTML={{ __html: post.descr as string }}></div>  
                <button onClick={clickHandler(post.id)}>Read More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>  
  )
}

export default Home

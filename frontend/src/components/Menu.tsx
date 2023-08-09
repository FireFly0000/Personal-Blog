import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface Props{
  cat: string | undefined
  single_post_id : number | undefined
}

interface Post{
  id: number
  title: string
  descr: string
  img: string
  date: Date
  uid: number
  cat: string
}


const Menu = ({cat, single_post_id} :Props) => {

  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()
  
  const clickHandler = (pid: number) =>{
    return (event: React.MouseEvent) =>{
      event.preventDefault()
      navigate(`/post/${pid}`)
    }
  }

  useEffect(() =>{
    const fetchPosts = async () =>{
      try{
        const res = await axios.get(`/posts/?cat=${cat}`)
        setPosts(res.data)
      }
      catch(err){
        console.log(err)
      }
    }
    fetchPosts()
  }, [cat])
    return (
    <div className='menu'>
      <h1>Other Posts You May Like</h1>
      {posts.map(post =>(
        <div className="post" key={post.id}>
          { post.id === single_post_id 
             ? <></>  
            :<>
              <img src={`src/assets/uploads/${post.img}`} alt=""/>
              <Link className='link' to={`/post/${post.id}`}>
                <h2>{post.title}</h2>
              </Link>  
              <button onClick={clickHandler(post.id)}>Read More</button>
            </>
          }
        </div>
      ))}
    </div>
  )
}

export default Menu

import axios from 'axios';
import moment from 'moment';
import React, {useState} from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

interface Inputs{
  cat: string
  name: string
}

const Write = () => {
  const navigate = useNavigate()
  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || "");
  const [descr, setDescr] = useState(state?.descr || <></>);
  const [imgFile, setImgFile] = useState<File | undefined>(undefined);
  const [cat, setCat] = useState(state?.cat || "");
  const {access_token} = useAuth()

  const uploadImg = async () =>{
    try{
      const formData = new FormData();
      if(imgFile === undefined) return
      formData.append("file", imgFile)
      const options = {
        method: 'POST',
        data: formData,
        url: "https://personal-blog-backend-deploy.vercel.app/api/upload"
      };
      const res = await axios(options);
      console.log(res)
      return res.data

    }catch(err){
      console.log(err)
    }
  }

  const ChangeImage = (e: React.FormEvent<HTMLInputElement>) =>{
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }

    setImgFile(target.files[0])
  }

  const handleSubmit = async (e: React.MouseEvent) =>{
    e.preventDefault()
    const imgURL = await uploadImg()

    try{
      state ? await axios.put(`/posts/${state.id}`, {
        title,
        descr,
        cat,
        img: imgFile ? imgURL : state.img,
        access_token: access_token
      }, {withCredentials: true})
      :
      await axios.post(`/posts/`, {
        title,
        descr,
        cat,
        img: imgFile ? imgURL : "",
        access_token: access_token,
        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
      }, {withCredentials: true});
      navigate("/home")
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="container">
      <div className='write-page'>
        <div className="content">
          <input type='text' value={title} placeholder='Title' onChange={e=>setTitle(e.target.value)}/>
          <div className="editor-container">
            <ReactQuill className="editor" theme="snow" value={descr} onChange={setDescr} />
          </div>
        </div>
        <div className="menu">
          <div className="write-menu-item">
            <h1>Publish</h1>
            <span>
              <b>Status: </b> Draft
            </span>
            <span>
              <b>Visibility: </b> Publish
            </span>
            <input style={{display:"none"}} type= "file" id='file' name='file' onChange={ChangeImage}/>
            <label className='upload-img-label' htmlFor='file'>Upload Image</label>
            <label>{imgFile ? <>{imgFile.name}</> : <>{state?.img}</>}</label>
            <div className="write-page-btns">
              <button className='save-btn'>Save as a draft</button>
              <button className='update-btn' onClick={handleSubmit}>{ state? <>Update </> : <>Publish</>}</button>
            </div>
          </div>
          <div className="write-menu-item">
            <h1>Category</h1>
            <div className="cat">
              <input type="radio" checked={cat === "art"} name='cat' value="art" id='art'onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="art">ART</label>
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "cinema"} name='cat' value="cinema" id='cinema' onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="cinema">CINEMA</label>
            </div>  
            <div className="cat">
              <input type="radio" checked={cat === "traveling"} name='cat' value="traveling" id='traveling' onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="traveling">TRAVELING</label>
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "video_games"} name='cat' value="video_games" id='video_games' onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="video_games">VIDEO GAMES</label>
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "photography"} name='cat' value="photography" id='photography' onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="video_games">PHOTOGRAPHY</label>
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "music"} name='cat' value="music" id='music' onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="music">MUSIC</label>
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "food"} name='cat' value="food" id='food' onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="food">FOOD</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Write

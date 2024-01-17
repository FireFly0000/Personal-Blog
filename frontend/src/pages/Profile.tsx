import { useState, useEffect, useRef} from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext'
import  Modal  from '../components/Modal' 
import EmptyAvatar from '../assets/empty_avatar.jpg'
import axios from 'axios'
import ImageCropper from '../components/ImageCropper';

interface User{
  username: string
  email: string
  img: string
}

const Profile = () => {
  
  const {currentUser, access_token, fetchCurrentUserInfo} = useAuth()
  const [user, setUser] = useState<User>()
  const [inputs, setInputs] = useState({
    username: currentUser.username,
    email: "",
    access_token: access_token,
  });
  const myLocation = useLocation()
  const [uid, setUid] = useState(parseInt(myLocation.pathname.split("/")[2]))
  const [ErrorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);


  useEffect(() =>{
    const fetchUser = async () =>{
      const newUID = myLocation.pathname.split("/")[2]
      await setUid(parseInt(newUID))
      try{
        const res = await axios.get(`/users/${newUID}`)
        await setUser(res.data)
        await initializeInputEmail(res.data.email)
      }
      catch(err){
        console.log(err)
      }
    }
    fetchUser()
  }, [myLocation.pathname]);

  const initializeInputEmail = (userEmail: string) =>{
    setInputs((prev) => ({ ...prev, email: userEmail}));
  }

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateHandler = async (e: React.ChangeEvent<HTMLFormElement>) =>{
    e.preventDefault()
    try{
      await axios.put('users/updateInfo', inputs)
      await fetchCurrentUserInfo()
      location.reload()
    }
    catch(err: any){
      console.log(err)
      setErrorMessage(err.response.data)
    }
  }

  return (
    <div className='profile-page'>
        { uid != currentUser.id ?
          <img className='avatar-display' src={user?.img === null ? EmptyAvatar : user?.img}/> :
          <img className='avatar-display' src={currentUser?.img === null ? EmptyAvatar : currentUser?.img}/>
        }
        {uid === currentUser.id && <button onClick={() => setOpenModal(true)}>Change Avatar</button>}
        <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}>
          <ImageCropper onClose={() => {setOpenModal(false)}}/>
        </Modal>
        <form className='info-form' onSubmit={updateHandler}>
          <span>Username</span>
          <input className={uid != currentUser.id ? 'not-currentUser-input' : 'currentUser-input'} required type='text' placeholder='username' name='username' 
            defaultValue={uid != currentUser.id ? user?.username : currentUser?.username} disabled={uid != currentUser.id} onChange={handleInputsChange}/>
          <span>Email</span>
          <input className={uid != currentUser.id ? 'not-currentUser-input' : 'currentUser-input'} required type='text' placeholder='email' name='email' 
            defaultValue={uid != currentUser.id ? user?.email : currentUser?.email} disabled={uid != currentUser.id} onChange={handleInputsChange}/>
          {ErrorMessage != "" && <p>{ErrorMessage}</p>}
          {uid === currentUser.id && <button type='submit'>Update</button>}
        </form>
    </div>
  )
}

export default Profile

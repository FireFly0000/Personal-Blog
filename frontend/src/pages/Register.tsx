import {Link, useNavigate} from 'react-router-dom'
import logo from '../assets/logo.png'
import { useState } from 'react';
import axios from 'axios';
import ImageSlider from '../components/ImageSlider';
import { SliderData } from '../components/SliderData';


const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [ErrorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const RegisterHandler = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    try{
      await axios.post("auth/register", inputs)
      navigate("/")
    }
    catch(err: any){
      setErrorMessage(err.response.data)
    }
  }

  return (
    <div className="auth-page-container">
      <div className='auth-page'>
        <img className='logo' src={logo}/>
        <div className='auth-container'>
          <h1 className='auth-title'>Register</h1>
            <form className='auth-form' onSubmit={RegisterHandler}>
              <input required type='text' placeholder='username' name='username' onChange={handleChange}/>
              <input required type='text' placeholder='email' name='email' onChange={handleChange}/>
              <input required type='password' placeholder='password' name='password' onChange={handleChange}/>
              <input required type='password' placeholder='confirm password' onChange={e=>setConfirmPassword(e.target.value)}/>
              <button disabled={inputs.password != confirmPassword} type='submit'>Register</button>
              {ErrorMessage != "" && <p>{ErrorMessage}</p>}
              {inputs.password !== confirmPassword ? <p>Passwords do not match</p> : <></>}
              <Link className='link-btn' to='/login'> Already have an account? Login</Link>
            </form>
        </div>
      </div>
      <ImageSlider slides={SliderData}/>  
    </div>  
  )
}

export default Register

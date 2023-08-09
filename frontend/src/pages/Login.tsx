import {Link, useNavigate} from 'react-router-dom'
import logo from '../assets/logo.png'
import { useState } from 'react';
import { useAuth } from '../context/authContext';
import ImageSlider from '../components/ImageSlider';
import { SliderData } from '../components/SliderData';

const Login = () => {

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [ErrorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()

  const {login} = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const LoginHandler = async (e: React.ChangeEvent<HTMLFormElement>) =>{
    e.preventDefault()
    try{
      await login(inputs)
      navigate("/home")
    }
    catch(err: any){
      console.log(err)
      setErrorMessage(err.response.data)
    }
  }

  return (
    <div className="auth-page-container">
      <div className='auth-page auth-item'>
        <img className='logo' src={logo}/>
        <div className='auth-container'>
          <h1 className='auth-title'>Login</h1>
            <form className='auth-form' onSubmit={LoginHandler}>
              <input required type='text' placeholder='username' name='username' onChange={handleChange}/>
              <input required type='password' placeholder='password' name='password' onChange={handleChange}/>
              <button type='submit'>Login</button>
              {ErrorMessage && <p>{ErrorMessage}</p>}
              <Link className='link-btn' to='/register'> Don't have an account? Register</Link>
            </form>
        </div>
      </div>
        <ImageSlider slides={SliderData}/>  
    </div>  
  )
}

export default Login

import { createBrowserRouter, RouterProvider, Outlet, Router } from 'react-router-dom'
import './style.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Write from './pages/Write'
import Single from './pages/Single'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import axios from 'axios'

axios.defaults.baseURL = `https://personal-blog-backend-deploy.vercel.app/api`
const Layout = () =>{
  return(
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path:"/home",
        element: <Home/>
      },
      {
        path:"/write",
        element: <Write/>
      },
      {
        path:"/post/:id",
        element: <Single/>
      },
    ]
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/",
    element: <Login/>
  },
]);

function App() {

  return (
        <RouterProvider router={router} />
  )
}

export default App

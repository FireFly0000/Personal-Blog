import { createContext, useState, useEffect, useContext} from "react";
import React from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

interface Inputs{
    username: String;
    password: String
}

type authContextType = {
  currentUser: any;
  access_token: string | null
  login: (inputs: Inputs) => void;
  logout: () => void;
  fetchCurrentUserInfo: () => void;
};

const authContextDefaultValues: authContextType = {
  currentUser: null,
  access_token: null,
  login: (inputs: Inputs) => {},
  logout: () => {},
  fetchCurrentUserInfo: () => {}
};

interface Props {
    children?: React.ReactNode
    // any props that come into the component
}

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children}: Props) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || '{}'));
    const [access_token, setAccessToken] = useState(localStorage.getItem("access_token") || '')

    const login = async(inputs: Inputs)=>{
        const res = await axios.post("auth/login", inputs, { withCredentials: true })
        setCurrentUser(res.data.other)
        setAccessToken(res.data.access_token)
    }

    const logout = async()=>{
        axios.get("auth/logout", { withCredentials: true})
        await setCurrentUser(null)
        await localStorage.setItem("access_token", '')
    }

    const fetchCurrentUserInfo = async()=>{
        const res = await axios.get(`auth/fetchCurrentUserInfo/${access_token}`)
        console.log(res.data.user)
        await setCurrentUser(res.data.user)
    }

    useEffect(() =>{
        localStorage.setItem("user", JSON.stringify(currentUser))
        localStorage.setItem("access_token", access_token)
        let slide_index = 0
        localStorage.setItem('slide_index', slide_index.toString())
    },[currentUser]);


    return(
        <AuthContext.Provider value={{currentUser, access_token, login, logout, fetchCurrentUserInfo}}>{children}</AuthContext.Provider>
    )
}
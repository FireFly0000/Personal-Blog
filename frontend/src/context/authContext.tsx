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
  login: (inputs: Inputs) => void;
  logout: () => void;
};

const authContextDefaultValues: authContextType = {
  currentUser: null,
  login: (inputs: Inputs) => {},
  logout: () => {},
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

    const login = async(inputs: Inputs)=>{
        const res = await axios.post("auth/login", inputs, { withCredentials: true })
        setCurrentUser(res.data)
    }

    const logout = async()=>{
        axios.get("auth/logout", { withCredentials: true})
        await setCurrentUser(null)
    }

    useEffect(() =>{
        localStorage.setItem("user", JSON.stringify(currentUser))
        let slide_index = 0
        localStorage.setItem('slide_index', slide_index.toString())
    },[currentUser]);


    return(
        <AuthContext.Provider value={{currentUser,login, logout}}>{children}</AuthContext.Provider>
    )
}
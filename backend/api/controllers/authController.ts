import { db } from "../db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    await db.query("SELECT * FROM users WHERE email = $1 OR username = $2", [req.body.email, req.body.username], async (err, data)=>{
        if(err) return res.status(500).json(err)
        if(data.rowCount > 0) return res.status(409).json("Username or email already existed")

        //Hash password and create the user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        await db.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3)", [req.body.username, hash ,req.body.email], (err)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        })
    
    })
}

export const login = async (req,res)=>{
    res.header("Access-Control-Allow-Headers","*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

    //CHECK FOR USERNAME
    await db.query("SELECT * FROM users WHERE username = $1", [req.body.username], async (err, data)=>{
        
        if(err) return res.json(err)
        if(data.rowCount === 0) return res.status(404).json("Username does not exist !");
    
        //CHECK FOR PASSWORD
        const correctPassword = bcrypt.compareSync(req.body.password, data.rows[0].password)

        if(!correctPassword) return res.status(400).json("Wrong password!");

        const token = jwt.sign({id: data.rows[0].id}, "OmegaXL_Night_2023");
        
        //SEPARATE PASSWORD AND OTHER USER'S INFORMATION
        const {password, ...other} = data.rows[0]
        if(password === null) console.log("NULL PASSWORD")  

        return res.cookie("access_token", token, {httpOnly: true, 
        domain: 'personal-blog-frontend-deploy.vercel.app', path: '', secure: true, sameSite: false }).status(200).json({other, access_token: token})
    })    
}

export const fetchCurrentUserInfo = (req,res)=>{
    const token = req.params.access_token
    if(!token) return res.status(401).json("NOT AUTHENTICATED!")

    jwt.verify(token, "OmegaXL_Night_2023", async (err, userInfo) =>{
        if(err) return res.status(403).json("Token is not valid!")
        
        const query = "SELECT id, username, email, img  FROM users WHERE id=$1";

        await db.query(query, [userInfo.id], (err, data) =>{
            if(err) return res.json(err)
            if(data.rowCount === 0) {
                console.log(userInfo, req.params)
                return res.status(404).json("User does not exist !");
            }

            const user = data.rows[0]
            return res.status(200).json({user})
        })
    })
}

export const logout = (req,res)=>{
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    }).status(200).json("User logged out successfully.")
}
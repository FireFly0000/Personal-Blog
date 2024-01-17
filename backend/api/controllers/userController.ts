import { db } from "../db"
import jwt from 'jsonwebtoken'

export const getUser = async (req,res)=>{
    const query = "SELECT username, email, img FROM users WHERE users.id = $1"

    await db.query(query, [req.params.id], (err,data) =>{
        if(err) return res.status(500).json(err)

        return res.status(200).json(data.rows[0])        
    })
}

export const updateUser = async (req,res)=>{
    const token = req.body.access_token
    if(!token) return res.status(401).json("NOT AUTHENTICATED!")

    jwt.verify(token, "OmegaXL_Night_2023", async (err, userInfo) =>{
        if(err) return res.status(403).json("Token is not valid!")
        
        await db.query("SELECT * FROM users WHERE (email = $1 OR username = $2) AND id != $3", [req.body.email, req.body.username, userInfo.id], async (err, data)=>{
            if(err) return res.status(500).json(err)
            if(data.rowCount > 0) return res.status(409).json("email or username already taken")
            
            const query = "UPDATE users SET username=$1, email=$2 WHERE id=$3";
            
            const values = [
                req.body.username,
                req.body.email,
            ]
            await db.query(query, [...values, userInfo.id], (err) =>{
                if(err) return res.status(403).json("You have to be the owner of the account to update")
            
                return res.status(200).json("User-info updated successfully")
            })
        })
    })
}

export const updateUserImg = (req,res)=>{
    const token = req.body.access_token
    if(!token) return res.status(401).json("NOT AUTHENTICATED!")

    jwt.verify(token, "OmegaXL_Night_2023", async (err, userInfo) =>{
        if(err) return res.status(403).json("Token is not valid!")
        
        const query = "UPDATE users SET img=$1 WHERE id=$2";
    
        const values = [
            req.body.img,
        ]

        await db.query(query, [...values, userInfo.id], (err) =>{
            if(err) return res.status(403).json("You have to be the owner of the account to update avatar")
        
            return res.status(200).json("Post updated successfully")
        })
    })
}
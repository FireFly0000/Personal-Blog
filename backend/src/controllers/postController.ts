import { db } from "../db"
import jwt from 'jsonwebtoken'

export const getAllPosts = async (req,res)=>{
    const query = req.query.cat 
    ? "SELECT * FROM posts WHERE cat=$1"
    : "SELECT * FROM posts"
    await db.query(query, req.query.cat ? [req.query.cat] : null, (err, data) =>{
        if(err) return res.status(500).json(err)
        return res.status(200).json(data.rows)
    })
}

export const getPost = async (req,res)=>{
    const query = "SELECT username, title, descr, p.img, p.id, u.img AS userImg, cat, date FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = $1"

    await db.query(query, [req.params.id], (err,data) =>{
        if(err) return res.status(500).json(err)

        return res.status(200).json(data.rows[0])        
    })
}

export const addPost = (req,res)=>{
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("NOT AUTHENTICATED!")

    jwt.verify(token, "OmegaXL_Night_2023", async (err, userInfo) =>{
        if(err) return res.status(403).json("Token is not valid!")
        
        const query = "INSERT INTO posts (title, descr, img, cat, date, uid) VALUES ($1, $2, $3, $4, $5, $6)"
    
        const values = [
            req.body.title,
            req.body.descr,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ]

        await db.query(query, values, (err, data) =>{
            if(err) return res.status(403).json("You have to be the owner of the post to delete")
        
            return res.status(200).json(data)
        })
    })
}

export const deletePost = (req,res)=>{
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("NOT AUTHENTICATED!")

    jwt.verify(token, "OmegaXL_Night_2023", async (err, userInfo) =>{
        if(err) return res.status(403).json("Token is not valid!")

        const postId = req.params.id
        const query = "DELETE FROM posts WHERE id=$1 AND uid=$2" 

        await db.query(query, [postId, userInfo.id], (err) =>{
            if(err) return res.status(500).json(err)
        
            return res.status(200).json("New post added successfully!")
        })
    })
}

export const updatePost = (req,res)=>{
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("NOT AUTHENTICATED!")

    jwt.verify(token, "OmegaXL_Night_2023", async (err, userInfo) =>{
        if(err) return res.status(403).json("Token is not valid!")
        
        const query = "UPDATE posts SET title=$1, descr=$2, img=$3, cat=$4 WHERE id=$5 AND uid=$6";
    
        const values = [
            req.body.title,
            req.body.descr,
            req.body.img,
            req.body.cat,
        ]
        const postID = req.params.id


        await db.query(query, [...values, postID, userInfo.id], (err) =>{
            if(err) return res.status(403).json("You have to be the owner of the post to update")
        
            return res.status(200).json("Post updated successfully")
        })
    })
}
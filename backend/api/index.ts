import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import postRoutes from './routes/posts'
import multer from 'multer'


const app = express();
const port = process.env.PORT || 8800;
app.use(cookieParser())

app.use(
    cors({
        credentials: true,
        origin: "https://personal-blog-frontend-deploy.vercel.app/"
    })
);
app.use(express.json())

//Upload image to frontend server using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'D:/Downloads/personal-blog/backend/api/upload/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
        req['filename'] = Date.now() + file.originalname
    }
})
const upload = multer({storage})

app.post('/api/upload', upload.any(), (req, res) =>{
    res.status(200).json(req['filename'])
})
//====================================================

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.listen(port, () => {
    console.log("connected");
});
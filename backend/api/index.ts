import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import postRoutes from './routes/posts'
import multer from 'multer'
import {v2 as cloudinary} from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary'

interface Params{
    allowed_formats: string[]
    unique_filename: boolean
    folder: string
}

const app = express();
const port = process.env.PORT || 8800;
app.use(cookieParser())

app.use(
    cors({
        credentials: true,
        origin: "https://personal-blog-frontend-deploy.vercel.app",
    })
);
app.use(express.json())

//Upload image to frontend server using multer
    //use Cloudinary as cloud storage for images
cloudinary.config({ 
    cloud_name: 'dkv4gihl5', 
    api_key: '923567222872294', 
    api_secret: 'tmMeHPgU6n4fPeQ3uqDGzjTLUOI' 
  });

/*const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const dest = path.join(process.cwd())
        cb(null, dest)
    },
    filename: function(req, file, cb){
        const Currtime = Date.now()
        cb(null, Currtime + file.originalname)
        req['filename'] = Currtime + file.originalname
    }
})*/

const storage = CloudinaryStorage({
    cloudinary,
    params: {
      allowed_formats: ['jpg', 'png', 'gif'],
      unique_filename: false,
      folder: 'upload',
      public_id: function (req, file){
        return Date.now() + file.originalname
    }
    } as Params
  });

const upload = multer({storage})

//======================================================
app.post('/api/upload', upload.any(), (req, res) =>{
    res.json(req.files[0].path)
    /*cloudinary.uploader.upload( `${req['filename']}`, function(err, data){
        if(err){
            res.status(400).json(err)
        }
        res.status(200).json(data)
    })*/
})
//====================================================

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.listen(port, () => {
    console.log("connected");
});
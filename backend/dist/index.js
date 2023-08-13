"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const posts_1 = __importDefault(require("./routes/posts"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = __importDefault(require("multer-storage-cloudinary"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8800;
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "https://personal-blog-frontend-deploy.vercel.app",
}));
app.use(express_1.default.json());
//Upload image to frontend server using multer
//use Cloudinary as cloud storage for images
cloudinary_1.v2.config({
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
const storage = (0, multer_storage_cloudinary_1.default)({
    cloudinary: cloudinary_1.v2,
    params: {
        allowed_formats: ['jpg', 'png', 'gif'],
        unique_filename: false,
        folder: 'upload',
        public_id: function (req, file) {
            return Date.now() + file.originalname;
        }
    }
});
const upload = (0, multer_1.default)({ storage });
//======================================================
app.post('/api/upload', upload.any(), (req, res) => {
    res.json(req.files[0].path);
    /*cloudinary.uploader.upload( `${req['filename']}`, function(err, data){
        if(err){
            res.status(400).json(err)
        }
        res.status(200).json(data)
    })*/
});
//====================================================
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/posts", posts_1.default);
app.listen(port, () => {
    console.log("connected");
});
//# sourceMappingURL=index.js.map
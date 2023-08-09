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
const app = (0, express_1.default)();
const port = 8800;
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
}));
app.use(express_1.default.json());
//Upload image to frontend server using multer
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/src/assets/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
        req['filename'] = Date.now() + file.originalname;
    }
});
const upload = (0, multer_1.default)({ storage });
app.post('/api/upload', upload.any(), (req, res) => {
    res.status(200).json(req['filename']);
});
//====================================================
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/posts", posts_1.default);
app.listen(port, () => {
    console.log("connected");
});
//# sourceMappingURL=app.js.map
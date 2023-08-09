"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.deletePost = exports.addPost = exports.getPost = exports.getAllPosts = void 0;
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.cat
        ? "SELECT * FROM posts WHERE cat=$1"
        : "SELECT * FROM posts";
    yield db_1.db.query(query, req.query.cat ? [req.query.cat] : null, (err, data) => {
        if (err)
            return res.status(500).json(err);
        return res.status(200).json(data.rows);
    });
});
exports.getAllPosts = getAllPosts;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT username, title, descr, p.img, p.id, u.img AS userImg, cat, date FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = $1";
    yield db_1.db.query(query, [req.params.id], (err, data) => {
        if (err)
            return res.status(500).json(err);
        return res.status(200).json(data.rows[0]);
    });
});
exports.getPost = getPost;
const addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token)
        return res.status(401).json("NOT AUTHENTICATED!");
    jsonwebtoken_1.default.verify(token, "OmegaXL_Night_2023", (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json("Token is not valid!");
        const query = "INSERT INTO posts (title, descr, img, cat, date, uid) VALUES ($1, $2, $3, $4, $5, $6)";
        const values = [
            req.body.title,
            req.body.descr,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ];
        yield db_1.db.query(query, values, (err, data) => {
            if (err)
                return res.status(403).json("You have to be the owner of the post to delete");
            return res.status(200).json(data);
        });
    }));
};
exports.addPost = addPost;
const deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token)
        return res.status(401).json("NOT AUTHENTICATED!");
    jsonwebtoken_1.default.verify(token, "OmegaXL_Night_2023", (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json("Token is not valid!");
        const postId = req.params.id;
        const query = "DELETE FROM posts WHERE id=$1 AND uid=$2";
        yield db_1.db.query(query, [postId, userInfo.id], (err) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json("New post added successfully!");
        });
    }));
};
exports.deletePost = deletePost;
const updatePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token)
        return res.status(401).json("NOT AUTHENTICATED!");
    jsonwebtoken_1.default.verify(token, "OmegaXL_Night_2023", (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json("Token is not valid!");
        const query = "UPDATE posts SET title=$1, descr=$2, img=$3, cat=$4 WHERE id=$5 AND uid=$6";
        const values = [
            req.body.title,
            req.body.descr,
            req.body.img,
            req.body.cat,
        ];
        const postID = req.params.id;
        yield db_1.db.query(query, [...values, postID, userInfo.id], (err) => {
            if (err)
                return res.status(403).json("You have to be the owner of the post to update");
            return res.status(200).json("Post updated successfully");
        });
    }));
};
exports.updatePost = updatePost;
//# sourceMappingURL=postController.js.map
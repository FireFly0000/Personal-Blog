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
exports.updateUserImg = exports.updateUser = exports.getUser = void 0;
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT username, email, img FROM users WHERE users.id = $1";
    yield db_1.db.query(query, [req.params.id], (err, data) => {
        if (err)
            return res.status(500).json(err);
        return res.status(200).json(data.rows[0]);
    });
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.access_token;
    if (!token)
        return res.status(401).json("NOT AUTHENTICATED!");
    jsonwebtoken_1.default.verify(token, "OmegaXL_Night_2023", (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json("Token is not valid!");
        yield db_1.db.query("SELECT * FROM users WHERE (email = $1 OR username = $2) AND id != $3", [req.body.email, req.body.username, userInfo.id], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return res.status(500).json(err);
            if (data.rowCount > 0)
                return res.status(409).json("email or username already taken");
            const query = "UPDATE users SET username=$1, email=$2 WHERE id=$3";
            const values = [
                req.body.username,
                req.body.email,
            ];
            yield db_1.db.query(query, [...values, userInfo.id], (err) => {
                if (err)
                    return res.status(403).json("You have to be the owner of the account to update");
                return res.status(200).json("User-info updated successfully");
            });
        }));
    }));
});
exports.updateUser = updateUser;
const updateUserImg = (req, res) => {
    const token = req.body.access_token;
    if (!token)
        return res.status(401).json("NOT AUTHENTICATED!");
    jsonwebtoken_1.default.verify(token, "OmegaXL_Night_2023", (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json("Token is not valid!");
        const query = "UPDATE users SET img=$1 WHERE id=$2";
        const values = [
            req.body.img,
        ];
        yield db_1.db.query(query, [...values, userInfo.id], (err) => {
            if (err)
                return res.status(403).json("You have to be the owner of the account to update avatar");
            return res.status(200).json("Post updated successfully");
        });
    }));
};
exports.updateUserImg = updateUserImg;
//# sourceMappingURL=userController.js.map
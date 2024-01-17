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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.fetchCurrentUserInfo = exports.login = exports.register = void 0;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.query("SELECT * FROM users WHERE email = $1 OR username = $2", [req.body.email, req.body.username], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(500).json(err);
        if (data.rowCount > 0)
            return res.status(409).json("Username or email already existed");
        //Hash password and create the user
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(req.body.password, salt);
        yield db_1.db.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3)", [req.body.username, hash, req.body.email], (err) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });
    }));
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.header("Access-Control-Allow-Headers", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //CHECK FOR USERNAME
    yield db_1.db.query("SELECT * FROM users WHERE username = $1", [req.body.username], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.json(err);
        if (data.rowCount === 0)
            return res.status(404).json("Username does not exist !");
        //CHECK FOR PASSWORD
        const correctPassword = bcryptjs_1.default.compareSync(req.body.password, data.rows[0].password);
        if (!correctPassword)
            return res.status(400).json("Wrong password!");
        const token = jsonwebtoken_1.default.sign({ id: data.rows[0].id }, "OmegaXL_Night_2023");
        //SEPARATE PASSWORD AND OTHER USER'S INFORMATION
        const _a = data.rows[0], { password } = _a, other = __rest(_a, ["password"]);
        if (password === null)
            console.log("NULL PASSWORD");
        return res.cookie("access_token", token, { httpOnly: true,
            domain: 'personal-blog-frontend-deploy.vercel.app', path: '', secure: true, sameSite: false }).status(200).json({ other, access_token: token });
    }));
});
exports.login = login;
const fetchCurrentUserInfo = (req, res) => {
    const token = req.params.access_token;
    if (!token)
        return res.status(401).json("NOT AUTHENTICATED!");
    jsonwebtoken_1.default.verify(token, "OmegaXL_Night_2023", (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json("Token is not valid!");
        const query = "SELECT id, username, email, img  FROM users WHERE id=$1";
        yield db_1.db.query(query, [userInfo.id], (err, data) => {
            if (err)
                return res.json(err);
            if (data.rowCount === 0) {
                console.log(userInfo, req.params);
                return res.status(404).json("User does not exist !");
            }
            const user = data.rows[0];
            return res.status(200).json({ user });
        });
    }));
};
exports.fetchCurrentUserInfo = fetchCurrentUserInfo;
const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User logged out successfully.");
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map
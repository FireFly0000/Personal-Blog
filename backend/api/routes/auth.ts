import express from 'express'
import { login, logout, register, fetchCurrentUserInfo } from '../controllers/authController'

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/fetchCurrentUserInfo/:access_token", fetchCurrentUserInfo)


export default router 
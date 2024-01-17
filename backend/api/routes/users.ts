import express from 'express'
import { getUser, updateUser, updateUserImg } from '../controllers/userController'

const router = express.Router()
router.get("/:id", getUser);
router.put("/updateInfo", updateUser)
router.put("/updateUserImg", updateUserImg)


export default router 
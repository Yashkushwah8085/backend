import express from "express"
import { ForgetPassword, Updateuser, UserLogin, UserRegister } from "../controller/user.controller.js"

const router = express.Router()

router.post("/register",UserRegister)
router.post("/login",UserLogin)
router.put("/update/:id",Updateuser)
router.post("/forgetpassword",ForgetPassword)

export default router
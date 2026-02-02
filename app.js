import express from "express"
import cookieParser from "cookie-parser"
import Database from "./config/mongoose.connection.js"
import UserRouter from "./router/user.router.js"
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/user",UserRouter)

app.listen(3000)
console.log("server invoked at link http://localhost:3000")
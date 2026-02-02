import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { SendMailer } from "../utils/Sendmailer.js";

export const UserRegister = async (req, res) => {
    let { Name, Email, Password, Mobile, Gender, City } = req.body

    let user = await UserModel.findOne({ Email })
    if (user) return res.send(500).send("user Already registered")
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(Password, salt, async (err, hash) => {

            const user = await UserModel.create({
                Name,
                Email,
                Password: hash,
                Mobile,
                Gender,
                City
            });
            let Token = jwt.sign({ userid: user._id }, "123456")
            console.log("Token", Token)

            res.cookie("Token", Token, { httpOnly: true })

            return res.status(201).send({
                message: "user Registered successfully",
                user: {
                    id: user._id,
                    Name: user.Name
                },
                Token,
            })
        })

    })
}

export const UserLogin = async (req, res) => {
    const { Email, Password } = req.body;

    const user = await UserModel.findOne({ Email });
    if (!user) {
        return res.status(404).send({ message: "User not found" })
    }

    const Ismatch = await bcrypt.compare(Password, user.Password);
    if (!Ismatch) {
        return res.status(401).send({ message: "invalid password" });
    }

    const Token = jwt.sign({ Email: user.Email, user }, "hhhh");

    res.cookie("Token", Token);

    res.status(200).send({
        message: "Login successfully",
        user: {
            id: user._id,
            Name: user.Name,
            Email: user.Email
        },
        Token,
    })
}


export const Updateuser = async (req, res) => {
    try {
        const { id } = req.params
        const { Name, Email, Password, Contact } = req.body

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (Email && Email !== user.Email) {
            const Exist = await UserModel.findOne({ Email });
            if (Exist) {
                return res.status(400).send({ message: "email already exists" });
            }
            user.Email = Email
        }
        if (Name) user.Name = Name;
        if (Email) user.Email = Email;
        if (Password) user.Password = Password;
        if (Contact) user.Contact = Contact;

        if (Password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(Password, salt);
            user.Password = hash
        }
        await user.save();

        res.status(200).send({
            message:"User update successfully",
            user:{
                id:user._id,
                Name:user.Name,
                Email:user.Email,
                Password:user.Password,
                Contact:user.Contact,
                City:user.City
            },
        });
    } catch (err) {
        res.status(500).send({message:error.message})

    }
};

export const ForgetPassword = async (req,res) =>{
    try{
      const {Email} = req.body;

      const user = await UserModel.findOne({Email});
      if(!user){
        return res.status(404).send({message:"Email Not Registered"})
      }

      const ResetToken = crypto.randomBytes(20).toString("hex")
      user.ResetToken = ResetToken;
      user.ResetTokenExpire = Date.now() + 10*60*2000;

      await user.save();

      const RestLink = `http://localhost:3000/resetpassword/${ResetToken}`;

      const html = `
      <h3>Password Reset</h3>
      <p>Click Link to ResetPassword:</p>
      <a href="${RestLink}">${RestLink}</a>
      <p>Valid to 2 minutes</p>
      `;

      await SendMailer(user.Email,"reset password",html);
      res.status(200).send({message:"reset link send to mail"});

    }catch(error){
        res.status(500).send({message:error.message})
    }
}





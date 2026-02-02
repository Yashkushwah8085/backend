import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    Name:String,
    Email:{
        type:String,
        unique:true
    },
    Password:String,
    Contact:Number,
    City:String,
    Gender:String
})

const UserModel = mongoose.model("Details",UserSchema);

export default UserModel
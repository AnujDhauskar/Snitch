import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

async function sendTokenResponse(user,res){
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}


export const register = async (req,res) =>{
    const {email, password, contact, fullname} = req.body;

    try{
        // Check if user already exists

        const existingUser = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        });
        if(existingUser){
            return res.status(400).json({success:false,message:"User already exists with this email or contact number"})
        }

        // Create new user
        const user = await userModel.create({
            email,
            password,
            contact,
            fullname
        });

    }catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Server error"})
    }
}
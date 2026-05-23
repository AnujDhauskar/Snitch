import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

async function sendTokenResponse(user,res,message){
    const token = jwt.sign({id:user._id}, config.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("token", token)

    res.status(200).json({
        message,
        success:true,
        user:{
            id:user._id,
            email:user.email,
            contact:user.contact,
            fullname:user.fullname,
            role:user.role
        }
    })
}


export const register = async (req,res) =>{
    const {email, password, contact, fullname, isSeller} = req.body;

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
            fullname,
            role: isSeller ? "seller" : "buyer"
        });

        await sendTokenResponse(user,res,"User registered successfully")

    }catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Server error"})
    }
}

export const login = async (req,res) =>{
    const {email, password} = req.body;

    try{
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        await sendTokenResponse(user,res,"User logged in successfully")
    }catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Server error"})
    }
}
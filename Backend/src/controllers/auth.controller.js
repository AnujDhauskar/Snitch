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

export const googleLoginCallback = async (req, res) => {
    try {
        const profile = req.user;
        const email = profile.emails?.[0]?.value;
        const fullname = profile.displayName;
        const googleId = profile.id;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
            return res.redirect("http://localhost:5173/login?error=no_email");
        }

        // Find by googleId first, then fall back to email
        let user = await userModel.findOne({ googleId });
        if (!user) {
            user = await userModel.findOne({ email });
            if (user) {
                // Link googleId to existing email account
                user.googleId = googleId;
                if (avatar) user.avatar = avatar;
                await user.save();
            } else {
                // Brand new Google user
                user = await userModel.create({ email, fullname, googleId, avatar });
            }
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "lax",
        });

        res.redirect("http://localhost:5173/");
    } catch (error) {
        console.error("Google callback error:", error);
        res.redirect("http://localhost:5173/login?error=google_failed");
    }
}

export const getMe = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({ success: false, message: "User not found" });

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                contact: user.contact,
                fullname: user.fullname,
                avatar: user.avatar,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}
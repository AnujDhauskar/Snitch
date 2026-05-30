import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validators/auth.validator.js";
import { register, login, googleLoginCallback, getMe } from "../controllers/auth.controller.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.midleware.js";

const router = Router();

/**
 * @route /api/auth/register
 * @desc Register a new user
 * @access Public
 * @returns User data
 */
router.post("/register", validateRegisterUser, register);

/**
 * @route /api/auth/login
 * @desc Login a user
 * @access Public
 * @returns User data
 */
router.post("/login", validateLoginUser, login);


/**
 * @route /api/auth/google
 * @desc Redirect to Google for authentication
 * @access Public
 * @returns Redirect to Google
 */
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"], prompt: "select_account" }));

/**
 * @route /api/auth/google/callback
 * @desc Callback route for Google OAuth
 * @access Public
 * @returns User data
 */
router.get("/google/callback", 
    passport.authenticate("google", {
        session: false,
        failureRedirect:"http://localhost:5173/login"
    }),
    googleLoginCallback  
);

/**
 * @route /api/auth/me
 * @desc Get the current user data
 * @access Private
 * @returns User data
 */
router.get("/me",authenticateUser,getMe)


export default router; 
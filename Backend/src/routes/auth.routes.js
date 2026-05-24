import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validators/auth.validator.js";
import { register, login, googleLoginCallback, getMe } from "../controllers/auth.controller.js";
import passport from "passport";

const router = Router();

router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"], prompt: "select_account" }));

router.get("/google/callback", 
    passport.authenticate("google", {session: false}),
    googleLoginCallback  
);


export default router;
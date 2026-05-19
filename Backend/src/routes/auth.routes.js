import { Router } from "express";
import { validateRegisterUser } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validateRegisterUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User registration successful",
    data: req.body,
  });
});


export default router;
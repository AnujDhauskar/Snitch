import {body,validationResult} from "express-validator";


function validateRequest(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,errors:errors.array()});
    }
    next();
}

export const validateRegisterUser = [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("contact").isMobilePhone().withMessage("Please enter a valid contact number"),
    body("fullname")
    .notEmpty().withMessage("Full name is required")
    .isLength({min:3}).withMessage("Full name must be at least 3 characters long"),
    body("isSeller").isBoolean().withMessage("isSeller must be a boolean"),
    
    validateRequest
] 
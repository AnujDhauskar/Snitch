import {body, validationResult} from "express-validator";


function validateRequest(req,res,next){
    const errors = validationResult (req);

    if(!errors.isEmpty()){
        return res.status(400).json({message:" validation error", errors:
            errors.array()
        });

    }

    next();
}

export const createProductValidator = [
    body("title").notEmpty().trim().withMessage("Title is required"),

    body("description").notEmpty().trim().withMessage("Description is required"),

    body("priceAmount").notEmpty().withMessage("Price amount is required"),

    body("priceCurrency").notEmpty().withMessage("Price currency is required"),

    validateRequest
]

export const addVariantValidator = [
    body("priceAmount").notEmpty().withMessage("Price amount is required"),
    validateRequest
]
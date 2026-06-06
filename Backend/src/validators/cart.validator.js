import { param, body, validationResult } from "express-validator";

const validateRequest= (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateAddToCart = [
    param('productId').notEmpty().isMongoId().withMessage("Please enter a valid product id"),
    param('varientId').notEmpty().isMongoId().withMessage("Please enter a valid variant id"),
    body('quantity').optional().isInt({min:1}).withMessage("Quantity must be at least 1"),
    validateRequest
]
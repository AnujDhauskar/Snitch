import express from "express";
import { authenticateSeller } from "../middlewares/auth.midleware.js";
import { createProduct,getSellerProducts } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validators/product.validator.js";

const upload = multer({ storage: multer.memoryStorage(),
    limits:{
        fileSize: 7*1024*1024
    }
 });

const router = express.Router();
/**
 * @route POST api/products/
 * @description Create a new product
 * @access Private (Seller)
 */
router.post("/", authenticateSeller,upload.array("images", 7),createProductValidator,createProduct);


/**
 * @route GET api/products/
 * @description Get all products of the authenticate seller
 * @access Private (Seller)
 */

router.get("/seller",authenticateSeller,getSellerProducts);


export default router;

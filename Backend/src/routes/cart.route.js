import express from 'express';
import {authenticateUser} from "../middlewares/auth.midleware.js";
import { validateAddToCart } from '../validators/cart.validator.js';
import { addToCart,getCart } from '../controllers/cart.controller.js';

const CartRouter = express.Router();    

/**
 * @route POST/api/cart/:productid/:varientId
 * @description Add Product/varient to cart
 * @access Private
 * 
 */

CartRouter.post('/add/:productId/:varientId',authenticateUser, validateAddToCart,addToCart);

/**
 * @route GET/api/cart
 * @description Get Cart
 * @access Private
 */

CartRouter.get("/",authenticateUser,getCart)

export default CartRouter;
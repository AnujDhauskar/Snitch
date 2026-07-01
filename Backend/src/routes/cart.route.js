import express from 'express';
import {authenticateUser} from "../middlewares/auth.midleware.js";
import { validateAddToCart } from '../validators/cart.validator.js';
import { addToCart,createOrderController,getCart, removeItemFromCart, updateCartItemQuantity } from '../controllers/cart.controller.js';

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

/**
 * @route DELETE /api/cart/remove/:productId/:varientId
 * @description Remove Product/varient from cart
 * @access Private
 */
CartRouter.delete('/remove/:productId/:varientId', authenticateUser, removeItemFromCart);

/**
 * @route PUT /api/cart/update/:productId/:varientId
 * @description Update cart item quantity
 * @access Private
 */
CartRouter.put('/update/:productId/:varientId', authenticateUser, updateCartItemQuantity);

/**
 * @route POST /api/payment/create/order
 * @description Create payment intent
 * @access Private
 */
CartRouter.post("/payment/create/order",authenticateUser, createOrderController);

export default CartRouter;
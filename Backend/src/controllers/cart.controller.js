import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVarient } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel  from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";




export const addToCart = async (req,res)=> {
    const { productId, varientId } = req.params
    const quantity = req.body.quantity || 1;
    const product = await productModel.findOne({
        _id:productId,
        "varients._id":varientId
    })

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found!"
        })
    }

    
    const stock = await stockOfVarient(productId, varientId) 

    const cart = (await cartModel.findOne({ user:req.user._id })) || await cartModel.create({user:req.user._id})
    const isProductAlreadyInCart = cart.items.some((item)=>{
        return item.product.toString() === product._id.toString() &&
        item.variant?.toString() === varientId
    })

    if(isProductAlreadyInCart){
        const cartItem = cart.items.find(item=> item.product.toString() === productId && item.variant?.toString() === varientId)
        if(cartItem.quantity + quantity > stock){
            return res.status(400).json({
                success:false,
                message:`only ${stock-cartItem.quantity} items left in stock and you already have ${cartItem.quantity} items in cart`
            })
        }

        await cartModel.findOneAndUpdate(
            {user:req.user._id, "items.product": productId, "items.variant": varientId},
            {$inc: {"items.$.quantity": quantity}},
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Item quantity updated in cart"
        })
    }

    if(quantity > stock){
        return res.status(400).json({
            success:false,
            message:`only ${stock} items left in stock`
        })
    }
    
    cart.items.push({
        product:productId,
        variant:varientId,
        quantity:quantity,
        price:product.price
    })

    await cart.save()

    return res.status(200).json({
        success:true,
        message:"Item added to cart"
    })

}
 
export const getCart = async(req,res) => {
    try {
        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            cart = await cartModel.create({ user: req.user._id });
            return res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                cart: { ...cart.toObject(), totalPrice: 0, items: [] }
            });
        }

        if (cart.items.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                cart: { ...cart.toObject(), totalPrice: 0, items: [] }
            });
        }

        const cartDetails = await getCartDetails(req.user._id);

        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true, 
            cart: cartDetails.length > 0 ? cartDetails[0] : { ...cart.toObject(), totalPrice: 0, items: [] }
        });
    } catch (error) {
        console.error("Error in getCart:", error);
        return res.status(500).json({ success: false, message: error.message, error: error.toString() });
    }
}

export const removeItemFromCart = async (req, res) => {
    try {
        const { productId, varientId } = req.params;
        const cart = await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: { product: productId, variant: varientId } } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Item removed from cart"
        });
    } catch (error) {
        console.error("Error in removeItemFromCart:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, varientId } = req.params;
        const { quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        const stock = await stockOfVarient(productId, varientId);
        if (quantity > stock) {
            return res.status(400).json({ success: false, message: `Only ${stock} items left in stock` });
        }

        const cart = await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": varientId },
            { $set: { "items.$.quantity": quantity } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        return res.status(200).json({
            success: true,
            message: "Item quantity updated"
        });
    } catch (error) {
        console.error("Error in updateCartItemQuantity:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createOrderController = async (req,res) =>{

    const cartDetails = await getCartDetails(req.user._id);
    if(!cartDetails || cartDetails.length === 0){
        return res.status(400).json({
            message:"Cart is Empty",
            success:false
        })
    }
   const cart = cartDetails[0];
   const order = await createOrder({amount:cart.totalPrice,currency:cart.currency})
   const payment = await paymentModel.create({
    user: req.user._id,
    razorpay:{
        orderId:order.id
    },
    price:{
        amount:cart.totalPrice,
        currency:cart.currency
    },
    orderItems: cart.items.map(item => ({
        title: item.product.title,
        productId:item.product.id,
        quantity:item.quantity,
        images:item.product.varients.images || item.product.images,
        price:item.price,
        variantId:item.varient,
        description: item.product.description,
        price:{
            amount:item.product?.varients?.price?.amount || item.product?.price?.amount,
            currency:item.product?.varients?.price?.currency || item.product?.price?.currency
        }
    }))
    
    
   })

   return res.status(200).json({
    message:"order created successfully",
    success:true,
    order
   })
}

export const verifyOrderController = async (req,res) => {
    try {
        const{
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        console.log("verifyOrderController received body:", req.body);

        const payment = await paymentModel.findOne({
            "razorpay.orderId" : razorpay_order_id,
            status:"pending"
        })
        
        console.log("Found payment:", payment);

        if(!payment){
            return res.status(404).json({
                success:false,
                message:"Payment not found!"
            })
        }

        // validatePaymentVerification expects 3 args: (params, signature, secret)
        const isPaymentValid = validatePaymentVerification(
            {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id
            },
            razorpay_signature,
            config.RAZORPAY_KEY_SECRET
        );

        if(!isPaymentValid){
            payment.status = "failed"
            await payment.save()

            return res.status(400).json({
                message:"Payment Verification failed",
                success: false
            })
        }

        payment.status = "paid"
        payment.razorpay.paymentId = razorpay_payment_id;
        payment.razorpay.signature = razorpay_signature;

        await payment.save();

        return res.status(200).json({
            message:"Payment Verification successful",
            success:true,
            payment
        })
    } catch (error) {
        console.error("Error in verifyOrderController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error during payment verification"
        })
    }
}

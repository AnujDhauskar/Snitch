import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVarient } from "../dao/product.dao.js";

export const addToCart = async (req,res)=> {
    const { productId, varientId } = req.params
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
        item.product.toString() === product._id.toString() &&
        item.variant?.toString() === varientId
    })

    if(isProductAlreadyInCart){
        const quantityInCart = cart.items.find(item=> item.product.toString() === productId && item.variant?.toString() === varientId)
        if(quantityInCart + quantity > stock){
            return res.status(400).json({
                success:false,
                message:`only ${stock-quantityInCart} items left in stock and you already have ${quantityInCart} items in cart`
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
    const user = req.user._id;
    let cart = await cartModel.findOne({ user : user._id}.populate("items.product"))

    if(!cart){
        cart = await cartModel.create({user:user._id})
    }

    return res.status(200).json(
        {
            message:"Cart fetched successfully",
            success:true, 
            cart
        }
    )
    
}

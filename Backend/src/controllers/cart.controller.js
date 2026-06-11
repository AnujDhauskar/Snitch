import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVarient } from "../dao/product.dao.js";

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

        const cartAgg = await cartModel.aggregate([
            {
                $match: {
                    user: cart.user // using ObjectId from the found document
                }
            },
            { $unwind: { path: '$items' } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'items.product'
                }
            },
            { $unwind: { path: '$items.product' } },
            {
                $addFields: {
                    "matchedVariant": {
                        $first: {
                            $filter: {
                                input: "$items.product.varients",
                                as: "v",
                                cond: { $eq: ["$$v._id", "$items.variant"] }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    itemPrice: {
                        price: {
                            $multiply: [
                                '$items.quantity',
                                '$matchedVariant.price.amount'
                            ]
                        },
                        currency: '$matchedVariant.price.currency'
                    }
                }
            },
            {
                $project: {
                    "matchedVariant": 0
                }
            },
            {
                $group: {
                    _id: '$_id',
                    user: { $first: '$user' },
                    totalPrice: { $sum: '$itemPrice.price' },
                    currency: {
                        $first: '$itemPrice.currency'
                    },
                    items: { $push: '$items' }
                }
            }
        ]);

        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true, 
            cart: cartAgg.length > 0 ? cartAgg[0] : { ...cart.toObject(), totalPrice: 0, items: [] }
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

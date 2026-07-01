import cartModel from "../models/cart.model.js";
import mongoose from "mongoose"

export async function getCartDetails(userId){
      const cart = await cartModel.aggregate([
            {
                $match: {
                    user: userId
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

        return cart
}
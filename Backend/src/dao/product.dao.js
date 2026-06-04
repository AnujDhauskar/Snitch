import productModel from "../models/product.model.js";

export const stockOfVarient = async(productId,varientId) => {
    const product = await productModel.findOne({
        _id:productId,
        "varients._id":varientId
    })

    const stock = product.varients.find(varient => varient._id.toString() === varientId).stock
    return stock
    
}
import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

 const paymentSchema = new mongoose.Schema({
    status:{
        type:String,
        enum:["pending","paid","failed"],
        default:"pending"
    },
    price:{
        type:priceSchema,
        required: true
    },
    razorpay:{
        orderId:{
            type:String
        },
        paymentId:{
            type:String
        },
        signature:{
            type:String
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderItems:[
        {
            title:String,
            productId:mongoose.Schema.Types.ObjectId,
            varientId:mongoose.Schema.Types.ObjectId,
            quantity:Number,
            images:[{url: String}],
            description:String,
            price: priceSchema
        }
    ]

 })

 const paymentModel = mongoose.model("payment", paymentSchema);

 export default paymentModel;
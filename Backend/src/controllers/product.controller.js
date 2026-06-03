import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req,res) {
    const { title,description,priceAmount,priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
       return await uploadFile({
        buffer: file.buffer,
        fileName:file.originalname 
       })
    }
))

const product = await productModel.create({
    title,
    description,
    price:{
        amount:priceAmount,
        currency:priceCurrency || "INR" 
    },
    images,
    seller: seller._id
})
 return res.status(201).json({
    message:"Product created successfully",
    success:true,
    product
 })

}

export async function getSellerProducts (req,res){
    const seller = req.user;
    const products = await productModel.find({
        seller: seller._id
    });

    return res.status(200).json({
        message:"Seller products fetched successfully",
        success:true,
        products
    })
}


export async function getAllProducts(req,res){
    const products = await productModel.find();
    return res.status(200).json({
        message:"All products fetched successfully",
        success:true,
        products
    })
}

export async function getProductsDetails(req,res){
    const{ id } = req.params;
    const product = await productModel.findById(id)
    if(!product){
        return res.status(404).json({
            message:"Product not found",
            success:false
        })
    }
    return res.status(200).json({
        message:"Product details fetched successfully",
        success:true,
        product
    })
}


export async function addProductVarient(req,res){

    const productId = req.params.productId;
    
    const product = await productModel.findOne({
        _id: productId,
        seller:req.user._id
    })

    if(!product){
        return res.status(404).json({
            message:"Product not found",
            success:false
        })
    }

    const files = req.files;
    let images = [];
    
    // FIX: Properly map the uploaded files and await all promises instead of using .map to push
    if(files && files.length !== 0){
        images = await Promise.all(files.map(async (file)=>{
            const image = await uploadFile({
                buffer: file.buffer,
                fileName:file.originalname
            })
            return image;
        }))
    }

    // FIX: Convert to Numbers and correct spelling of 'attributes'
    const price = Number(req.body.priceAmount) || 0;
    const stock = Number(req.body.stock) || 0;
    const attributes = JSON.parse(req.body.attributes || "{}");

    // FIX: Append the new variant to the product.varients array and save
    product.varients.push({
        images,
        stock,
        attributes,
        price: {
            amount: price,
            currency: "INR"
        }
    });

    await product.save();

    return res.status(200).json({
        message: "Variant added successfully",
        success: true,
        product
    });
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;

        const product = await productModel.findOne({ _id: id, seller: seller._id });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        if (req.file) {
            const newImage = await uploadFile({
                buffer: req.file.buffer,
                fileName: req.file.originalname
            });
            product.images = [newImage];
        }

        if (req.body.varients) {
            const updatedVarients = JSON.parse(req.body.varients);
            product.varients = updatedVarients.map(v => ({
                images: v.images,
                stock: Number(v.stock) || 0,
                attributes: v.attributes,
                price: v.price
            }));
        }

        await product.save();

        return res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating product", error: error.message, success: false });
    }
}
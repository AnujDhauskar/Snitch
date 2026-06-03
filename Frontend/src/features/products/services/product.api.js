import axios from "axios";


const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials:true
});

export async function createProduct(formData){
    const response = await productApiInstance.post("/",formData);
    return response.data;
}

export async function getSellerProduct(){
    const response = await productApiInstance.get("/seller")
    return response.data;
}

export async function getAllProducts(){
   const response = await productApiInstance.get("/");
   return response.data;
}


export async function getProductDetails(productId){
    const response = await productApiInstance.get(`/detail/${productId}`);
    return response.data;
} 

export async function addProductVarient(productId,newProductVarient){
    const formData = new FormData();

    newProductVarient.images.forEach((image)=>{
        // FIX: Ensure that we only append if image.file exists (e.g., an uploaded file)
        if (image.file) {
            formData.append("images", image.file);
        }
    });
    formData.append("stock",newProductVarient.stock);
    // FIX: Extract amount correctly since newProductVarient.price is { amount, currency }
    formData.append("priceAmount",newProductVarient.price.amount);
    formData.append("attributes",JSON.stringify(newProductVarient.attributes));
    
    const response = await productApiInstance.post(`/${productId}/varients`,formData);
    return response.data;
} 

export async function updateProduct(productId, productData) {
    const formData = new FormData();
    
    // Main image if changed and is a file object
    if (productData.images && productData.images[0] && productData.images[0].file) {
        formData.append("mainImage", productData.images[0].file);
    }

    // Always append varients so the multipart body is never empty
    formData.append("varients", JSON.stringify(productData.varients || []));
    
    const response = await productApiInstance.put(`/${productId}`, formData, {
        withCredentials: true,
    });
    return response.data;
}
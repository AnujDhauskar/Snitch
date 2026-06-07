import axios from "axios";

const cartApiInstance = axios.create({
    baseURL:"/api/cart",
    withCredentials:true
})

export const addItem = async({productId,varientId})=>{
 const response = await cartApiInstance.post(`/add/${productId}/${varientId}`, { quantity: 1 })
 return response.data
}

export const getCart = async() =>{
    const response = await cartApiInstance.get("/", {withCredentials:true})
    return response.data
}

export const removeItem = async({productId, varientId})=>{
    const response = await cartApiInstance.delete(`/remove/${productId}/${varientId}`);
    return response.data;
}

export const updateQuantity = async({productId, varientId, quantity})=>{
    const response = await cartApiInstance.put(`/update/${productId}/${varientId}`, {quantity});
    return response.data;
}
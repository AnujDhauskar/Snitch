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
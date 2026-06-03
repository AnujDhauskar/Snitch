import { createProduct,getSellerProduct,getAllProducts, getProductDetails, addProductVarient, updateProduct } from "../services/product.api";
import {useDispatch} from "react-redux";
import { setSellerProducts,setProducts } from "../state/product.slice";
import { useCallback } from "react";


export const useProduct = ()=> {
    const dispatch = useDispatch();

       const handleCreateProduct = useCallback(async (formdata) => {
        const data = await createProduct(formdata);
        return data.product
       }, []);

       const handleGetSellerProduct = useCallback(async () => {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products));
        return data.products
       }, [dispatch]);

       const handleGetAllProducts = useCallback(async () => {
        const data = await getAllProducts();
        dispatch(setProducts(data.products));
        return data.products;
       }, [dispatch]);

       async function handleGetProductById(productId){
        const data = await getProductDetails(productId);
        return data.product;
       }

       async function handleAddProductVarient(productId,newProductVarient){
        const data = await addProductVarient(productId,newProductVarient);
        return data;
       }

       async function handleUpdateProduct(productId, productData){
        const data = await updateProduct(productId, productData);
        return data;
       }

       return{
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleAddProductVarient,
        handleUpdateProduct
       }
}
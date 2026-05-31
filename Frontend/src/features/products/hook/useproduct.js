import { createProduct,getSellerProduct,getAllProducts } from "../services/product.api";
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

       return{
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts
       }
}
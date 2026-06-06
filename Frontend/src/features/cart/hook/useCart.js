import {addItem,getCart} from "../service/cart.api"
import {useDispatch} from "react-redux"
import {addItem as addItemToCart,setItems } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({productId,varientId}){
        const data = await addItem({productId,varientId});

        return data 
    }
    async function handleGetCart(){
        const data = await getCart();
        dispatch(setItems(data.cart.items))
    }

    return{handleAddItem,handleGetCart} 
}

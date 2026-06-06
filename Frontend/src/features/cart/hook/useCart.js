import {addItem} from "../service/cart.api"
import {useDispatch} from "react-redux"
import {addItem as addItemToCart } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({productId,varientId}){
        const data = await addItem({productId,varientId});

        return data 
    }

    return{handleAddItem}
}

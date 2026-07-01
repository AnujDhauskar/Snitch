import {addItem,getCart, removeItem, updateQuantity,createCartOrder} from "../service/cart.api"
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

    async function handleRemoveItem({productId, varientId}) {
        const data = await removeItem({productId, varientId});
        if(data.success) {
            handleGetCart();
        }
        return data;
    }

    async function handleUpdateQuantity({productId, varientId, quantity}) {
        const data = await updateQuantity({productId, varientId, quantity});
        if(data.success) {
            handleGetCart();
        }
        return data;
    }

    async function handleCreateCartOrder(){
          const data = await createCartOrder();
          return data.order || null
    }

    return{handleAddItem,handleGetCart, handleRemoveItem, handleUpdateQuantity, handleCreateCartOrder} 
}

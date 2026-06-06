import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'

const Cart = () => {
    const cartItems = useSelector(state=> state.cart.items)
    const {handleGetCart} = useCart()
    
    useEffect(()=>{
        handleGetCart()
    },[])

    useEffect(() => {
        console.log("Cart Data:", cartItems);
    }, [cartItems]);

  return (
    <div>Cart</div>
  )
}

export default Cart
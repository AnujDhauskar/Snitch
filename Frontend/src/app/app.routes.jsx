import {createBrowserRouter} from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/products/pages/Dashboard";
import CreateProduct from "../features/products/pages/CreateProduct";
import Protected from "../features/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetaile from "../features/products/pages/ProductDetaile";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path:"/product/:productId",
        element:<ProductDetaile/>
    },
    {
        path:"/cart",
        element:<Protected>
            <Cart/>
        </Protected>
    },
    {
        path:"/seller",
        children:[
            {
                path:"/seller/create-products",
                element: <Protected role="seller">
                    <CreateProduct />
                </Protected>
            },
            {
                path:"/seller/dashboard",
                element: <Protected role="seller">
                    <Dashboard />
                </Protected> 
            },
            {
                path:"/seller/product/:productId",
                element:<Protected role = "seller">
                    <SellerProductDetails/>
                    </Protected>
            }
        ]
    }
])
import {createBrowserRouter} from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/products/pages/Dashboard";
import CreateProduct from "../features/products/pages/CreateProduct";
import Protected from "../features/components/Protected";
import BuyerDashboard from "../features/auth/components/BuyerDashboard";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <BuyerDashboard />
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

            }
        ]
    }
])
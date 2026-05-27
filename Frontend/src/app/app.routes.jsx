import {createBrowserRouter} from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/dashboard/pages/Dashboard";
import CreateProduct from "../features/products/pages/CreateProduct";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />
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
        path:"/seller/create-products",
        element: <CreateProduct />
    }
])
import { setError, setUser, setloading } from "../state/auth.slice";
import { register,login, getMe } from "../service/auth.api";
import { useDispatch, useSelector } from "react-redux"

export const useAuth = ()=>{
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)

    async function handleRegister({email, contact, password, fullname, isSeller = false}){
        try {
            dispatch(setloading(true))
            dispatch(setError(null))
            const data = await register({email, contact, password, fullname, isSeller});
            dispatch(setUser(data.user))
            return data.user
        } catch (err) {
            let errMsg = "Registration failed. Please try again."
            if (err.response?.data) {
                if (err.response.data.message) {
                    errMsg = err.response.data.message
                } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                    errMsg = err.response.data.errors.map(e => e.msg).join(", ")
                }
            } else if (err.message) {
                errMsg = err.message
            }
            dispatch(setError(errMsg))
            return { success: false, error: errMsg }
        } finally {
            dispatch(setloading(false))
        }
    }
    async function handleLogin({email, password}){
        try {
            dispatch(setloading(true))
            dispatch(setError(null))
            const data = await login({email, password})
            dispatch(setUser(data.user))
            return data.user
        } catch (err) {
            let errMsg = "Login failed. Please try again."
            if (err.response?.data) {
                if (err.response.data.message) {
                    errMsg = err.response.data.message
                } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                    errMsg = err.response.data.errors.map(e => e.msg).join(", ")
                }
            } else if (err.message) {
                errMsg = err.message
            }
            dispatch(setError(errMsg))
            return { success: false, error: errMsg }
        } finally {
            dispatch(setloading(false))
        }
    }
    async function handleGetMe(){   
        try{
            dispatch(setloading(true))
            dispatch(setError(null))
            const data = await getMe()
            dispatch(setUser(data.user))

        }catch(err){
            console.log(err);
        }finally{
            dispatch(setloading(false))
        }
       
    }
    return { handleRegister, handleLogin, handleGetMe,user, loading, error } 
}
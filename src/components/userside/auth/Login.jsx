import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import api from "../../../services/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/authSlice";

function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const form = useForm()
    const {register, control, handleSubmit, formState} = form;
    const {errors} = formState

    const onSubmit = async (data) => {
        try{
            const res = await api.post('token/', data)
            console.log(res)
            if(res.status === 200) {
                const {access, refresh, role} = res.data
                dispatch(loginSuccess({access_token:access, refresh_token:refresh, role}))
                toast.success('you are logged in')
                navigate('/')
            }
        }
        catch(error) {
            if (error.status === 401) {
                if (error.response && error.response && error.response.data) {
                    toast.error(error.response.data.detail)
                }
            }
            else{
                toast.error('there is some issue try again after some time')
            }
        }
    }

    
    return(
        <div className="h-screen flex justify-center items-center bg-yellow-50">
            <div className="h-[450px] border border-lime-200 w-[500px] bg-gradient-to-t from-lime-200 via-yellow-50  rounded-lg">
                <div className="flex justify-center mt-10">
                    <h1 className="text-2xl font-bold text-zinc-700">Login</h1>
                </div>

                <div className="flex justify-center mt-16">
                    <form  onSubmit={handleSubmit(onSubmit)} className="w-full mx-20">
                        <div className="">
                            <input type="text" {...register('username', {required:'username is required'})} className="w-full border rounded-lg p-2 focus:outline-none focus:border-lime-500" placeholder="username" /><br />
                            <p className="text-xs text-red-500 flex justify-end">{errors.username?.message} </p>
                            <input type="password" {...register('password', {required:'password is required', validate:(fieldValue) => {return fieldValue.length >= 6 || 'enter alteast 6 character'}})}   className="w-full border rounded-lg mt-6 p-2 focus:outline-none focus:border-lime-500" placeholder="password"/>
                            <p className="text-xs text-red-500 flex justify-end">{errors.password?.message} </p>
                            <button type="submit" className="w-full border mt-8 bg-gradient-to-r from-lime-400 via-lime-200 to-lime-400 text-lg font-semibold p-2 rounded-lg">Login</button>
                        </div>
                    </form>
                    
                </div>
                <div className="flex justify-center mt-8">
                    <p className="font-mono">I dont't have account, <span onClick={() => navigate('/register')} className="cursor-pointer  hover:text-lime-500">Register</span></p>
                </div>
            </div>
            
        </div>
    )
}

export default Login
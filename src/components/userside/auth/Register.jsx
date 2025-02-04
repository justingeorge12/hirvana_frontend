import { useNavigate } from "react-router-dom"
import {useForm} from 'react-hook-form'
import api from "../../../services/api";
import toast from "react-hot-toast";
// import {DevTool} from '@hookform/devtools'


function Register() {

    const navigate = useNavigate()

    const form = useForm()
    const {register, control, handleSubmit, formState} = form;
    const {errors} = formState

    const onSubmit = async (data) => {
        try{
            const res = await api.post('register', data)
            console.log(res)
            if (res.status === 201) {
                toast.success('you are registered, Please log in now')
                navigate('/login')
            }
        }
        catch (error) {
            console.log(error)
        }

        console.log(data)
    }

    return(
        <div className="h-screen flex justify-center items-center bg-yellow-50">
            <div className=" min-h-[500px] border border-lime-200 w-[500px] bg-gradient-to-t from-lime-200 via-yellow-50  rounded-lg">
                <div className="flex justify-center mt-6">
                    <h1 className="text-2xl font-bold text-zinc-700">Register </h1>
                </div>

                <div className="flex justify-center mt-10">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full mx-20">
                        <div className="">
                            <input type="text" id="username" {...register('username', {required:'username is required'})} className="w-full border rounded-lg p-2 focus:outline-none focus:border-lime-500" placeholder="username" /><br />
                            <p className="text-xs text-red-500 flex justify-end">{errors.username?.message} </p>
                            <input type="email" id="email" {...register('email', {required:'email is required', pattern:{value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message:'Invalid email format'}})} className="w-full border rounded-lg mt-5 p-2 focus:outline-none focus:border-lime-500" placeholder="email" /><br />
                            <p className="text-xs text-red-500 flex justify-end">{errors.email?.message}</p>
                            <input type="password" id="password" {...register('password', {required:'password is required', validate:(fieldValue) => {return fieldValue.length >= 6 || 'enter alteast 6 character'}})}  className="w-full border rounded-lg mt-5 p-2 focus:outline-none focus:border-lime-500" placeholder="password"/>
                            <p className="text-xs text-red-500 flex justify-end">{errors.password?.message}</p>
                            <input type="password" id="confirmpassword" {...register('confirmpassword', {required:'confirm password is required', validate:(fieldValue) => {return fieldValue.length >= 6 || 'enter alteast 6 character'}})} className="w-full border rounded-lg mt-5 p-2 focus:outline-none focus:border-lime-500" placeholder="confirm password"/>
                            <p className="text-xs text-red-500 flex justify-end">{errors.confirmpassword?.message}</p>
                            
                            <button type="submit" className="w-full border mt-8 bg-gradient-to-r from-lime-400 via-lime-200 to-lime-400 text-lg font-semibold p-2 rounded-lg">Register</button>
                        </div>
                    </form>
                    {/* <DevTool control={control} /> */}
                </div>
                <div className="flex justify-center mt-8">
                    <p className="font-mono">I have account, <span onClick={() => navigate('/login')} className="cursor-pointer hover:text-lime-500">Login</span></p>
                </div>
            </div>
            
        </div>
    )
}

export default Register
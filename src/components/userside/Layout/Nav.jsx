import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { logout } from "../../../redux/authSlice";

function Nav() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const handleLogout = async () => {
        try{
          const token = localStorage.getItem('refresh')
        //   const res = await api.post('logout', {token})
          localStorage.clear()
          dispatch(logout())
          delete api.defaults.headers.common["Authorization"];
          navigate('/login')
    
        }
        catch (err) {
          console.log(err)
          localStorage.clear()
          dispatch(logout())
          delete api.defaults.headers.common["Authorization"];
          navigate('/login')
        }
      }

      

    return (
        <div className="fixed top-0 left-0 right-0 h-20 backdrop-blur-md bg-white/30 z-50">
            <div className="flex justify-center items-center h-full">
                <div className="w-full max-w-4xl mx-auto px-4 py-3 rounded-xl bg-lime-200/50 shadow-sm shadow-lime-100">
                    <div className="flex justify-between">
                        <div>
                            <h1 onClick={() => navigate('/')} className="bg-gradient-to-bl cursor-pointer from-transparent via-lime-500 to-transparent p-2 rounded-lg text-lg text-white font-title ">
                            HIRVANA
                            </h1>
                        </div>
                        <div>
                            <button onClick={() => navigate('/employees')} className="p-2 font-semibold hover:font-bold">Activities »</button>
                            <button onClick={() => handleLogout()} className="p-2 font-semibold hover:font-bold">Logout </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Nav;

import Nav from "../Layout/Nav"
import cycleImg from '../../../assets/cycle.png'
import arrow from '../../../assets/arrow.svg'
import { useNavigate } from "react-router-dom"

function Home() {

    const navigate = useNavigate()

    return(
        <div>
            <Nav />
            <div className="h-screen bg-gradient-to-tr from-lime-200 from-25% opacity-75">
                <div className="h-20"></div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex items-center ">
                        <div className="text-6xl mt-20 flex-col items-center font-semibold text-slate-900 ml-20 mr-10 ">
                            <p className="">
                                List your employees with ›› <span className="sm:text-7xl font-bold text-transparent bg-gradient-to-br from-orange-300  via-orange-600  to-slate-500  bg-clip-text ">Superpowers</span>
                            </p>
                            <p className="text-2xl mt-6 mr-6 font-bold">create the best <br /> employee you need</p>
                            <button onClick={() => navigate('/employees')} className="mt-6 text-xl font-bold bg-orange-500 px-4 py-2 rounded-3xl">Start working </button>
                        </div>
                    
                    </div>

                    <div className="flex justify-center items-center mt-20">
                        <img src={cycleImg} alt="cycleImg" className="h-96 rounded-lg " />
                    </div>
                </div>
            </div>
            <hr />
            <div className="h-screen bg-gradient-to-br from-lime-200 from-25% opacity-75">
                <div className="flex justify-center text-6xl font-semibold">
                    <h1 className="font-title">HIRVANA</h1><br />
                </div>
                <div className="flex justify-center my-16">
                    <img src={arrow} alt="" className="h-52"/>
                </div>
                <div className="grid justify-center text-7xl font-bold text-center gap-6">
                    <p className="cursor-default hover:text-orange-600 ">Manage Employees․</p>
                    <p className="cursor-default hover:text-violet-900">Performance Insights․</p>
                </div>
            </div>
            <hr className="border" />
            <div className="h-screen bg-gradient-to-tr from-lime-200 from-25% opacity-75">
                <div className="grid justify-center text-7xl font-bold text-center gap-6">
                    <p className="cursor-default hover:text-pink-700">Offline support․</p>
                    <p className="cursor-default hover:text-yellow-600">Nested List & Tasks․</p>
                    <p className="cursor-default hover:text-red-700">Control․</p>
                    <p className="cursor-default hover:text-cyan-800">Structure․</p>
                    <p className="cursor-default hover:text-green-600">Analyze․</p>

                </div>
            </div>
        </div>
    )
}

export default Home
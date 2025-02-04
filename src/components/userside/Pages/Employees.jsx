import { useEffect, useState } from "react";
import Nav from "../Layout/Nav"
import cycle from '../../../assets/cycle.png'
import AddEmployee from "./Modal/AddEmployee";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

function Employees() {

    const navigate = useNavigate()
    const [employList, setEmployList] = useState([])
    const [mangeModl, setManageModal] = useState(false)

    const fetchEmployees = async () => {
        try{
            const res = await api.get('get_empl/')
            console.log(res)
            setEmployList(res.data.employees)
        }
        catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchEmployees()
    },[])

    return(
        <div>
            <Nav />
            <div className="h-screen bg-gradient-to-tl from-lime-200">
                <div className="h-20"></div>
                <div className="mt-4 m-6">
                    <h1 className="text-3xl font-mono">People</h1>
                    <div className="bg-lime-50 mt-2 p-1 rounded-lg flex justify-end">
                        <button onClick={() => setManageModal(true)} className="p-1 px-3 rounded-md border bg-lime-100 border-lime-400">Add Employees</button>
                    </div>
                    <div className="mt-2 flex justify-end">
                        <div className="mr-4 text-3xl">
                            <button className="mr-4">⇦</button>
                            <button>⇨</button>
                        </div>
                    </div>
                    <div className="border bg-lime-50  rounded-xl relative overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm text-left rtl:text-right">
                            <thead className="text-sm uppercase border-b border-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Image</th>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">place</th>
                                    <th scope="col" className="px-6 py-3">Phone</th>
                                    <th scope="col" className="px-6 py-3">Action</th>

                                </tr>
                            </thead>

                            <tbody>
                                    {employList.length > 0 ? (
                                        employList.map((data, index) => (
                                            <tr key={index} onClick={() => navigate(`/employee/${data.id}`, {state:{emplData:data}})} className="hover:bg-lime-100 font-chakra font-semibold border">
                                                <td>
                                                    <div className="px-6 cursor-pointer">
                                                        <img src={cycle} alt="" className="h-12 rounded-lg" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 cursor-pointer">{data.name}</td>
                                                <td className="px-6 py-5">{data.email}</td>
                                                <td className="px-6 py-5">{data.address.city}</td>
                                                <td className="px-6 py-5">{data.phone}</td>
                                                <td className="px-6 py-5 cursor-pointer hover:font-semibold"> See details</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">
                                                <div className="flex flex-col justify-center items-center">
                                                    <p className="text-5xl mb-2 opacity-50">📭</p>
                                                    <p className="text-xl font-mono">No Data</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {mangeModl && <AddEmployee onClose={() => setManageModal(false)} fetchEmployees={fetchEmployees} />}
        </div>
    )
}

export default Employees
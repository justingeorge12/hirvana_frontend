import { useLocation, useNavigate } from "react-router-dom"
import Nav from "../Layout/Nav"
import { useState } from "react"
import CommonModal from "./Modal/CommonModal"
import toast from "react-hot-toast"
import api from "../../../services/api"
import AddEmployee from "./Modal/AddEmployee"
import noProfile from '../../../assets/noProfile.jpg'

function SingleEmployeeView() {

    const navigate = useNavigate()
    const location = useLocation()
    const emploData = location.state?.emplData

    const [deleteModal, setDeleteModal] = useState(false)
    const [manageModal, setManageModal] = useState(false)

    const deleteEmplo = async () => {
        try {

            // console.log(emploData.regid)
            const res = await api.delete('delete_empl/', {data: {"regid":emploData.regid}})
            console.log(res)
            if (res.status === 200) {
                toast.success('employee is removed successfully')
                navigate('/employees')
            }
        }
        catch (err) {
            console.log(err)

            toast.error('some issue are there, try again after some time')
        }
    }

    console.log(emploData)
    return(
        <div>
            <Nav />
            <div className="min-h-screen bg-gradient-to-tl from-lime-200">
                <div className="h-20"></div>
                <div className="m-4">
                    <div className="flex ">
                        <div className="text-center">
                            {/* <img src={noProfile} alt="" className=" mx-auto h-16 rounded-md" /> */}
                            <h1 className="text-3xl font-mono">{emploData.name}</h1>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-lime-100 to-white mt-2 p-1 rounded-lg flex justify-end">
                        <button></button>
                        <button onClick={() => setManageModal(true)} className="p-1 px-3 mr-2 rounded-md border bg-lime-100 border-lime-400">Edit Details</button>
                        <button onClick={() => setDeleteModal(true)} className="p-1 px-3 rounded-md border bg-red-200 border-red-400">Delete Details</button>
                    </div>
                    <div className="mt-6 ">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            <div className="border border-lime-500 bg-lime-100 bg-opacity-100 rounded-lg">
                                <div className="flex justify-center text-lg pb-3 p-1 font-bold">
                                    <h1>Address</h1> <br />
                                </div>
                                <div className="flex flex-col items-center font-chakra font-semibold">
                                    <p>{emploData.email}</p>
                                    <p>{emploData.age}</p>
                                    <p>{emploData.phone}</p>
                                    <p>{emploData.gender}</p>
                                </div>
                                <p className="flex justify-center font-bold my-2 border-y border-lime-400">home details</p>
                                <div className="flex flex-col items-center font-chakra font-semibold">
                                    <p>{emploData.address.homeNumber}</p>
                                    <p>{emploData.address.street}</p>
                                    <p>{emploData.address.city}</p>
                                    <p>{emploData.address.state}</p>
                                </div>
                            </div>



                            <div className="border border-lime-500 bg-lime-100 bg-opacity-100 rounded-lg">
                                <div className="flex justify-center text-lg pb-3 p-1 font-bold">
                                    <h1>Experience</h1> <br />
                                </div>
                                <table className="w-full text-sm text-left rtl:text-right">
                                    <thead className="text-sm border-b border-slate-100">
                                        <tr>
                                            <th scope="col" className="px-1 py-2">Company</th>
                                            <th scope="col" className="px-1 py-2">Start Date</th>
                                            <th scope="col" className="px-1 py-2">End Date</th>
                                            <th scope="col" className="px-1 py-2">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {emploData.workExperience[0].address ? (
                                            emploData.workExperience.map((data, index) => (
                                                <tr key={index} className="hover:bg-lime-100 font-chakra font-semibold border">
                                                    <td className="px-1 py-3 cursor-pointer">{data.company}</td>
                                                    <td className="px-1 py-3">{data.startDate}</td>
                                                    <td className="px-1 py-3">{data.endDate}</td>
                                                    <td className="px-1 py-3">{data.address}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    <div className="flex flex-col justify-center items-center">
                                                        <p className="text-3xl mb-2 opacity-50">📭</p>
                                                        <p className="text-lg font-mono">No Data</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>


                            <div className="border border-lime-500 bg-lime-100 bg-opacity-100 rounded-lg">
                                <div className="flex justify-center text-lg pb-3 p-1 font-bold">
                                    <h1>Qualifications</h1> <br />
                                </div>
                                <table className="w-full text-sm text-left rtl:text-right">
                                    <thead className="text-sm border-b border-slate-100">
                                        <tr>
                                            <th scope="col" className="px-1 py-2">Company</th>
                                            <th scope="col" className="px-1 py-2">Start Date</th>
                                            <th scope="col" className="px-1 py-2">End Date</th>
                                            <th scope="col" className="px-1 py-2">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {emploData.qualifications[0].name ? (
                                            emploData.qualifications.map((data, index) => (
                                                <tr key={index} className="hover:bg-lime-100 font-chakra font-semibold border">
                                                    <td className="px-1 py-3 cursor-pointer">{data.name}</td>
                                                    <td className="px-1 py-3">{data.startDate}</td>
                                                    <td className="px-1 py-3">{data.endDate}</td>
                                                    <td className="px-1 py-3">{data.percentage}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    <div className="flex flex-col justify-center items-center">
                                                        <p className="text-3xl mb-2 opacity-50">📭</p>
                                                        <p className="text-lg font-mono">No Data</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>


                            <div className="border border-lime-500 bg-lime-100 bg-opacity-100 rounded-lg">
                                <div className="flex justify-center text-lg pb-3 p-1 font-bold">
                                    <h1>Projects</h1> <br />
                                </div>
                                <table className="w-full text-sm text-left rtl:text-right">
                                    <thead className="text-sm border-b border-slate-100">
                                        <tr>
                                            <th scope="col" className="px-4 py-2">Title</th>
                                            <th scope="col" className="px-4 py-2">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {emploData.projects[0].title ? (
                                            emploData.projects.map((data, index) => (
                                                <tr key={index} className="hover:bg-lime-100 font-chakra font-semibold border">
                                                    <td className="px-4 py-3 cursor-pointer">{data.title}</td>
                                                    <td className="px-4 py-3">{data.description}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center py-4">
                                                    <div className="flex flex-col justify-center items-center">
                                                        <p className="text-3xl mb-2 opacity-50">📭</p>
                                                        <p className="text-lg font-mono">No Data</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
                {deleteModal && 
                    <CommonModal func={deleteEmplo} onClose={() => setDeleteModal(false)} message={`remove employee ${emploData.name}`}/>
                }
                {manageModal &&
                <AddEmployee onClose={() => setManageModal(false)} employee={emploData} />}
            </div>
        </div>
    )
}

export default SingleEmployeeView

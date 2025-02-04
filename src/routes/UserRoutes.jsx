import { useDeferredValue } from "react"
import { Route, Routes } from "react-router-dom"
import Home from "../components/userside/Pages/Home"
import Register from "../components/userside/auth/Register"
import Login from "../components/userside/auth/Login"
import NotFound from "../components/userside/Layout/NotFound"
import Employees from "../components/userside/Pages/Employees"
import LogProtected from "./Protected/LogProtected"
import ProtectedRoute from "./Protected/ProtectedRoute"
import SingleEmployeeView from "../components/userside/Pages/SingleEmployeeView"




function UserRoutes() {

    return(
        <div>
            <Routes>
                <Route path="/register" element={<LogProtected children={<Register /> } redirectedTo={'/'} /> } />
                <Route path="login" element={<LogProtected children={  <Login />} redirectedTo={'/'} /> } />
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute> } /> 
                <Route path="/employees" element={<ProtectedRoute> <Employees /> </ProtectedRoute> } />
                <Route path="/employee/:id" element={<ProtectedRoute> <SingleEmployeeView /> </ProtectedRoute>} />
            </Routes>
        </div>
    )
}

export default UserRoutes






// function UserRoutes() {

//     return(
//         <div>
//             <Routes>
//                 <Route path="/register" element={<Register />} />
//                 <Route path="login" element={<Login /> } />
//                 <Route path="*" element={<NotFound />} />
//                 <Route path="/" element={<Home />} /> 
//                 <Route path="/employee" element={<Employees />} />
//             </Routes>
//         </div>
//     )
// }

// export default UserRoutes
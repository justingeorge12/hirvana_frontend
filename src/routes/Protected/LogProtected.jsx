import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

function LogProtected({children, redirectedTo}) {
    
    const location = useLocation()
    const role = useSelector((state) => state.auth?.role)

    if (role && location.pathname !== redirectedTo) {
        return <Navigate to = {redirectedTo} replace />
    }

    return children
}

export default LogProtected
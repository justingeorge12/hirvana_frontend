import { Children, useEffect, useState } from "react"
import api from "../../services/api"
import {jwtDecode} from 'jwt-decode'
import { Navigate } from "react-router-dom"

function ProtectedRoute({children}) {

    const [isAutherized, setIsAutherized] = useState(null)

    const refreshToken = async () => {

        const refreshToken = localStorage.getItem('refresh_token')
        try{
            const res = await api.post('token/refresh', {refresh: refreshToken})

            if (res.status === 200) {
                localStorage.setItem('access_token', res.data.access)
                setIsAutherized(true)
            }
            else {
                setIsAutherized(false)
            }
        }
        catch(error) {
            setIsAutherized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem('access_token')
        const role = localStorage.getItem('role')

        if (!token){
            setIsAutherized(false)
            return
        }

        if (role !== 'user'){
            setIsAutherized(false)
            return
        }

        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() /1000

        if (tokenExpiration < now) {
            await refreshToken()
        } 
        else {
            setIsAutherized(true)
        }
    }

    useEffect(() => {
        auth().catch(() => setIsAutherized(false))
    }, [auth])

    if (isAutherized === null ){
        return <div>Loading....</div>
    }

    return isAutherized ? children : <Navigate to = '/login/' />
}

export default ProtectedRoute
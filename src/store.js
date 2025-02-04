
import { configureStore } from "@reduxjs/toolkit";
import authreducer from './redux/authSlice'


const store = configureStore({
    reducer : {
        auth : authreducer
    }
})

export default store
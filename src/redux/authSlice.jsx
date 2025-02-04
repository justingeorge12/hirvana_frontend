import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name : 'auth', 
    initialState:{
        role:localStorage.getItem('role'),
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token')
    },
    reducers:{

        loginSuccess: (state, action) => {
            state.role = action.payload.role;
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;

            localStorage.setItem('role', action.payload.role);
            localStorage.setItem('access_token', action.payload.access_token);
            localStorage.setItem('refresh_token', action.payload.refresh_token)
        },
        logout: (state) => {
            state.role = null;
            state.access_token = null;
            state.refresh_token = nulll;

            localStorage.removeItem('role');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token')
        }
    } 
})

export const {loginSuccess, logout} = authSlice.actions
export default authSlice.reducer
import api from './api.js'

// register new user 
export const registerUser = async(userdata) => {
    const res = await api.post('/api/v1i2/auth/register' , userdata)
    return res.data;
}

// Login with session (passport)
export const loginUser = async(credentials) => {
    const res = await api.post('/api/v1i2/auth/login-user' , credentials)
    return res.data;
}

// Logout user
export const logoutUser = async() => {
    const res = await api.get('/api/v1i2/auth/logout-user');
    return res.data;
}

// Check if user is authenticated (session cookie check)
export const checkAuth = async() => {
    const res = await api.get('/api/v1i2/auth/check-auth');
    return res.data;
}

// Google login 
export const googleLogin = () => {
    window.location.href = `http://localhost:8383/api/v1i2/auth/googlelogin-user`
}
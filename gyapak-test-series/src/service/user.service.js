import api from "./api.js";

// change password 
export const changePassword = async (newpassword) => {
    const res = api.post('/api/v1i2/user/change-password' , {newpassword})
    return res.data;
};

// request password reset
export const forgotPassword = async (email) => {
    const res = api.post('/api/v1i2/user/forgot-password' , {email})
    return res.data;
}

// reset password 
export const resetPassword = async (token , password) => {
    const res = api.post(`/api/v1i2/user/reset-password/${token}` , {password})
    return res.data;
}


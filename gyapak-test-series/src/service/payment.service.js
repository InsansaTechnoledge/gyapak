import api from './api.js'

// create razorpay order 
export const createOrder = async (payload) => {
    // payload should contain: receipt, testId[], amount, checkoutData

    const res = await api.post('/api/v1i2/payment/create-order' , payload)
    return res.data;
}

// Verify Razorpay payment (after signature verification)
export const verifyPayment = async (verificationPayload) => {
    // payload = { razorpay_order_id, razorpay_payment_id, razorpay_signature }

    const res = await api.post('/api/v1i2/payment/verify-payments' , verificationPayload)
    return res.data;
}

// get payment details by ID (for success page display)
export const getPayment = async (paymentId) => {
    const res = await api.get(`/api/v1i2/payment/get-payment/${paymentId}`)
    return res.data;
}


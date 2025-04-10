import { APIError } from '../ApiError.js';
import razorPayConfig from '../PaymentUtils/razorpayConfig.js';

//this function takes 2 parameters receipt , ammount and returns order
// currency is hard coded as INR and payment_capture is also hard coded to 1
// payment_capture is set to boolean value 1 captures the payment automatically , if want to opt for manual patyments then set it to 0

const razorpay = await razorPayConfig();

export const createOrderFunction = async (res, receipt, amount) => {
  const currency = 'INR';
  const payment_capture = 1;

  try {
    const option = {
      amount: Number.parseInt(amount * 100),
      receipt,
      currency,
      payment_capture,
    };


    const order = await razorpay.orders.create(option);

    return order;
  } catch (e) {
    //  res.json(new APIError(500, [e.message , "order creation failed"]))
    console.log(e.message);
  }
};

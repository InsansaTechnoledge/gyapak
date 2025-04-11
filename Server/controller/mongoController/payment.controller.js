import razorPayConfig from '../../Utility/PaymentUtils/razorpayConfig.js';
import { APIResponse } from '../../Utility/ApiResponse.js';
import { APIError } from '../../Utility/ApiError.js';
import { createOrderFunction } from '../../Utility/PaymentUtils/createOrder.js';
import Payment from '../../models/payment.model.js';
import User from '../../models/user.model.js';
import { paymentSignamtureValidationFunction } from '../../Utility/PaymentUtils/paymentSignatureValidation.js';
import mongoose from 'mongoose';
import { fetchExamById } from '../../Utility/SQL-Queries/exam.query.js';

const razorpay = await razorPayConfig();

// save payment detail in DB

export const createOrder = async (req, res) => {
  try {
    console.log('create order called');
    console.log(req.body);
    console.log(req.user);
    // collecting requirement from user
    // const { receipt, courseId, amount,checkoutData } = req.body;
    const receipt='1';
    const testId=['1'];
    const amount=100;
    const checkoutData={

      finalTotal:118
    }
    let order={};

    let paymentData={
      receipt,
      testId,
      // userId: req.user._id,
      userId:new mongoose.Types.ObjectId('67f6a6de3e12dd65d3f581b3'),
      amount,
      tax:{
        rate:0.18,
        amount:checkoutData.gstAmount
      },
      finalTotal:checkoutData.finalTotal
    };
    if(amount !==0){
    //creating order with createOrderFunction()
     order = await createOrderFunction(res, receipt, amount);
     const payment = await Payment.create({ ...paymentData, orderId: order.id,currency: order?.currency });
     order['payment_Id'] = payment._id;
     return new APIResponse(200, { order }, 'order created successfully ').send(
      res
    );
    }
    else{
      order={
        currency: 'INR',
        id: '0'+ Date.now(),
      }
      const payment = await Payment.create({ ...paymentData,status:'captured',orderId: order.id,currency: order?.currency });
      order['payment_Id'] = payment._id;
      const updatedUser = await User.findByIdAndUpdate(payment.userId, {
        $push: { 
          testPurchased: {
            $each: payment.testId.map(id => ({
              testId: id,
              date: Date.now(),
            }))
          }
        }
      },
      { new: true });

      return new APIResponse(200, { order:order,payment:payment._id,updatedUser:updatedUser}, 'order created successfully ').send(
        res
      );
    }
   
  } catch (e) {
    console.error('Error creating order:', e.message);
    return new APIError(500, [e.message, 'error']).send(res);
  }
};

// verify the razorpay payment

export const verifyPayment = async (req, res) => {
  try {
    const { paymentData, updatedUser } =
      await paymentSignamtureValidationFunction(req.body);
    return new APIResponse(
      200,
      { payment: paymentData, updatedUser },
      'paymentVerified'
    ).send(res);
  } catch (e) {
    return new APIError(500, [
      e.message,
      'payment was not able to verify',
    ]).send(res);
  }
};

// this controller fetch payment by paymentID and displays it at succes payment page

export const getPayment = async (req, res) => {
  try {
    const payment = req.payment;

    // for courses
    const testPromises = payment.testId.map(testId =>
      fetchExamById(testId)
    );

    const tests = await Promise.all(testPromises);

    const paymentData = {
      ...payment._doc,
      exams: tests,
    };
    return new APIResponse(
      200,
      { payment: paymentData },
      'payment data fetched successfully '
    ).send(res);
  } catch (e) {
    return new APIError(500, ['failed to fetch payment data', e.message]).send(
      res
    );
  }
};

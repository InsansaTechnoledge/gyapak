import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
import { RAZORPAY_KEY_SECRET } from '../../config/env.js';
import razorPayConfig from './razorpayConfig.js';
import Payment from '../../models/payment.model.js';
import User from '../../models/user.model.js';

const razorpay = await razorPayConfig();

export const paymentSignamtureValidationFunction = async function (params) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = params;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const secret = RAZORPAY_KEY_SECRET;

  try {
    const isValidateSignature = validateWebhookSignature(
      body,
      razorpay_signature,
      secret
    );
    console.log('Signature validation result:', isValidateSignature);

    if (isValidateSignature) {
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

      return updatePaymentDocument(paymentDetails);
    } else {
      return new Error('Payment verification failed');
    }
  } catch (e) {
    console.error('Error verifying payment:', e.message);
    return new Error(e.message);
  }
};

const updatePaymentDocument = async function (paymentDetails) {
  try {
    console.log('Payment details:');
    const payment = await Payment.findOneAndUpdate(
      { orderId: paymentDetails.order_id },
      {
        $set: {
          status: paymentDetails.status,
          transactionId: paymentDetails.acquirer_data.upi_transaction_id,
          paymentMethod: paymentDetails.method,
        },
      },
      { new: true } // Optional: returns the updated document
    );

    const paymentData = {
      _id: payment._id,
      paymentMethod: paymentDetails.method,
      status: paymentDetails.status,
      transactionId: paymentDetails.acquirer_data.upi_transaction_id,
      orderId: paymentDetails.order_id,
    };
    console.log('Payment data:');
    console.log(payment);
    const updateQuery = {
      $push: {
        testsPurchased: {
          $each: payment.testId.map(id => ({
            testId: id
            //model have to add
          })),
        },
      },
    };
    
    const updatedUser = await User.findByIdAndUpdate(
      payment.userId,
      updateQuery,
      { new: true }
    );
    console.log('Updated user:', updatedUser);
    console.log('Payment data:', paymentData);
    return { paymentData, updatedUser };
  } catch (e) {
    console.error('Error updating payment document:', e.message);
    return new Error(e.message);
  }
};

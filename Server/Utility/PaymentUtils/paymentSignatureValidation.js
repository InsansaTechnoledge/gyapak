import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
import { RAZORPAY_KEY_SECRET } from '../../config/env.js';
import razorPayConfig from './razorpayConfig.js';
import Payment from '../../models/payment.model.js';
import User from '../../models/user.model.js';


// this acts as a function that taks res.body as a parameter from the payment controller , this verifies payment and updates the payment records by updating transactionId , status and payment method , orderId
// also befor updating it take paymentdetails , from built in razorpay functio

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

    const updateQuery = {
      $push: {
        testPurchased: {
          $each: payment.testId.map(id => ({
            testId: id,
            date: Date.now()
          })),
        },
      },
      $inc: { courseCount: payment.courseId.length },
    };

    // const promo=payment.discount?.find(d => d.codeId);
    // if (promo) {
    //   updateQuery.$pull = { promoCode:promo.codeId };

    //   const promoCode = await PromoCode.findOneAndUpdate(
    //     { code: promo.codeId },
    //     { $inc: { usedCount: 1 } },
    //     { new: true }
    //   );
    // }
    
    const updatedUser = await User.findByIdAndUpdate(
      payment.userId,
      updateQuery,
      { new: true }
    );
    return { paymentData, updatedUser };
  } catch (e) {
    return new Error(e.message);
  }
};

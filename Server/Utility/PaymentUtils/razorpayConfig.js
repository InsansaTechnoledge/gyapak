import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../../config/env.js';
console.log('razorpay key id', RAZORPAY_KEY_ID);

const razorPayConfig = async () => {
  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  return razorpay;
};

export default razorPayConfig;

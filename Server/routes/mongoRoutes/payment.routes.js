import express from 'express';
import {
  createOrder,
  verifyPayment,
} from '../../controller/mongoController/payment.controller.js';
// import { userAndtransactionValidation } from '../Middleware/userAndTransactionValidation.js';
// import {validatePaymentDataMiddleware} from '../Middleware/paymentDataValidation.middleware.js';


//have to complete the paymentDataValidation middleware
const router = express.Router();

// router.post('/create-order', isLoggedInMiddleware,validatePaymentDataMiddleware,createOrder);
router.post('/create-order',createOrder);
// router.post(
//   '/verify-payments',
//   isLoggedInMiddleware,
//   userAndtransactionValidation,
//   verifyPayment
// );
router.post(
    '/verify-payments', verifyPayment
  );
// router.post(
//   '/get-payments',
//   isLoggedInMiddleware,
//   userAndtransactionValidation,
//   getPayment
// );

export default router;

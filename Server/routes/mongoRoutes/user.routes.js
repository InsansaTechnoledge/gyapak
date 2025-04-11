import express from 'express';
import { checkPassword } from '../../middleware/checkPass.middleware.js';
import {
  changePassword,
  forgotPassword,
  resetPassword,
} from '../../controller/mongoController/user.controller.js';
import { SensitiveInformationRateLimit } from '../../middleware/rateLimitChecks/SensitiveInfoRateLimit.middleware.js';
import { isLoggedInMiddleware } from '../../middleware/isLoggedIn.middleware.js';

const router = express.Router();

router.post(
  '/change-password',
  SensitiveInformationRateLimit,
  isLoggedInMiddleware,
  checkPassword,
  changePassword
);

router.post('/forgot-password', SensitiveInformationRateLimit,forgotPassword);
router.post('/reset-password/:token', SensitiveInformationRateLimit,resetPassword);


export default router;

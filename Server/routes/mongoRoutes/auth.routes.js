import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  googleCallback,
  googleProfile,
  googleAuth,
  checkAuth,
} from '../../controller/mongoController/auth.controller.js';
import { authenticateUserMiddleware } from '../../middleware/passport.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimitChecks/AuthRateLimit.middleware.js';
import { isLoggedInMiddleware } from '../../middleware/isLoggedIn.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login-user', authRateLimiter, authenticateUserMiddleware, loginUser);
router.get('/logout-user', logoutUser);
router.get('/googlelogin-user', googleAuth);
router.get('/callback', googleCallback);
router.get('/profile', googleProfile);
router.get('/check-auth', isLoggedInMiddleware, checkAuth);

export default router;

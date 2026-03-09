import express from 'express';
import { 
  loginUser,
  registerUser, 
  verifySignupOtp,
  sendLoginOtp,
  verifyLoginOtp,
  auth0Login,
  verifyForgotOtp,
  adminLogin,
  forgotPassword,
  resetPassword,
  forgotPasswordAdmin,
  verifyForgotOtpAdmin,
  changeAdminPassword,
  changeAdminCredentials
} from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/verify-otp', verifySignupOtp);
userRouter.post('/send-login-otp', sendLoginOtp);
userRouter.post('/verify-login-otp', verifyLoginOtp);
userRouter.post('/auth0', auth0Login);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/verify-forgot-otp', verifyForgotOtp);
// Admin specific forgot password flow that requires ADMIN_CODE
userRouter.post('/admin/forgot-password', forgotPasswordAdmin);
userRouter.post('/admin/verify-forgot-otp', verifyForgotOtpAdmin);

// Protected admin routes
userRouter.post('/admin/change-password', adminAuth, changeAdminPassword);
userRouter.post('/admin/change-credentials', adminAuth, changeAdminCredentials);

export default userRouter;
import express from 'express'
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  uploadBill,
  verifyStripe,
  verifyRazorpay,
  cancelOrder,
  updateNotes,
  updateUserNotes,
  updateTrackingUrl
} from '../controllers/orderController.js'
import { downloadBill } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/cancel', adminAuth, cancelOrder) // New cancellation route
orderRouter.post('/notes', adminAuth, updateNotes) // New notes route
orderRouter.post('/tracking', adminAuth, updateTrackingUrl) // New tracking route

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

// User Feature 
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/user-notes', authUser, updateUserNotes) // New user notes route
// Upload bill image by user (multipart/form-data: field 'bill')
orderRouter.post('/upload-bill', authUser, upload.single('bill'), uploadBill)
// Admin upload (admin can upload/replace bill for any order)
orderRouter.post('/admin/upload-bill', adminAuth, upload.single('bill'), uploadBill)
// Download invoice (owner or admin) - use GET with query ?orderId=...
orderRouter.get('/download-bill', downloadBill)

// verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)

export default orderRouter
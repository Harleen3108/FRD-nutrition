import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import { promisify } from 'util'
const unlinkAsync = promisify(fs.unlink)
import http from 'http'
import https from 'https'
import jwt from 'jsonwebtoken'
import { URL } from 'url'
import Stripe from 'stripe'
import razorpay from 'razorpay'
import sendMail from '../utils/mailer.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Email sending is handled via the centralized sendMail helper (frdbackend/utils/mailer.js)

// COMMON ORDER CREATION FUNCTION
// Assigns a per-user sequential order number and saves the order
// If `options.assignOrderNo` is false, the order will be created without consuming the user's order counter
const createOrder = async (orderData, options = { assignOrderNo: true }) => {
    if (!orderData.items || orderData.items.length === 0) {
        throw new Error("Cannot place order with empty cart");
    }

    // If assignOrderNo is requested, increment user's counter and set orderNo.
    // For payment-pending temporary orders (Stripe/Razorpay) we will create the order without assigning orderNo
    if (options.assignOrderNo) {
        if (orderData.userId) {
            const updatedUser = await userModel.findByIdAndUpdate(
                orderData.userId,
                { $inc: { lastOrderNo: 1 } },
                { new: true }
            );
            if (!updatedUser) throw new Error('User not found when assigning order number');
            orderData.orderNo = updatedUser.lastOrderNo;
            console.log('createOrder: assigned orderNo', orderData.orderNo, 'to user', orderData.userId);
        } else {
            // Fallback for guest orders: use timestamp-based number to avoid collision
            orderData.orderNo = Date.now();
            console.log('createOrder: guest order assigned timestamp orderNo', orderData.orderNo);
        }
    }
    if (!options.assignOrderNo) {
        console.log('createOrder: created temporary order (no orderNo) for user', orderData.userId || 'guest');
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    return newOrder;
}

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!items || items.length === 0) {
            return res.json({ 
                success: false, 
                message: "Your cart is empty. Please add items before placing order." 
            });
        }

        if (!userId || !amount || !address) {
            return res.json({ 
                success: false, 
                message: "Missing required order information" 
            });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false, // COD starts as unpaid
            date: Date.now(),
            status: 'Order Placed'
        }

        // Create COD order and assign per-user order number immediately
        // Create temporary Razorpay order without assigning per-user orderNo yet
        const newOrder = await createOrder(orderData, { assignOrderNo: false });
                // generate confirmation OTP and send email to the customer (prefer user.email)
                try {
                        const otp = Math.floor(100000 + Math.random() * 900000).toString();
                        newOrder.confirmationOtp = otp;
                        newOrder.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                        await newOrder.save();

                        // Prefer email from user record; fallback to address.email
                        const user = await userModel.findById(userId);
                        const toEmail = (user && user.email) ? user.email : (orderData.address && orderData.address.email) ? orderData.address.email : null;

                     const mailHtml = `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #052659 0%, #1a4b8c 100%); padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FRD PREMIUM NUTRIENTS</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
        <h2 style="color: #052659; margin-top: 0;">Order Confirmed! 🎉</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${order.address?.firstName || 'Customer'},</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Thank you for choosing FRD Premium Nutrients! Your order has been successfully placed and is being processed.</p>
        
        <!-- Order Details Box -->
        <div style="background: #f8f9fa; border-left: 4px solid #052659; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #052659; margin-top: 0;">Order Summary</h3>
            <p style="margin: 8px 0;"><strong>Order Number:</strong> #${order.orderNo}</p>
            <p style="margin: 8px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Total Amount:</strong> ₹${order.amount}</p>
            <p style="margin: 8px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <!-- OTP Box -->
        

        <!-- Next Steps -->
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">What's Next?</h4>
            <ul style="color: #856404; padding-left: 20px;">
                <li>Your order will be processed within 24 hours</li>
                <li>You will receive shipping confirmation soon</li>
                <li>Track your order using your account</li>
            </ul>
        </div>
    </div>
    
    <!-- Footer -->
    
</div>
`;

                        if (toEmail) await sendMail({ to: toEmail, subject: `Order #${newOrder.orderNo} Confirmation`, html: mailHtml });
                        else console.log('No customer email available to send order confirmation for order', newOrder.orderNo);
                } catch (err) {
                        console.log('Error sending order confirmation email:', err.message || err);
                }

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ 
            success: true, 
            message: "Order Placed Successfully",
            orderId: newOrder._id,
            orderNo: newOrder.orderNo
        });

    } catch (error) {
        console.log('COD Order Error:', error);
        res.json({ 
            success: false, 
            message: error.message || "Failed to place order" 
        });
    }
}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        if (!items || items.length === 0) {
            return res.json({ 
                success: false, 
                message: "Your cart is empty" 
            });
        }

        // Create temporary order with pending payment
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false, // Initially false
            date: Date.now(),
            status: 'Payment Pending'
        }

        // For Razorpay we create a temporary order WITHOUT assigning a per-user orderNo yet
        const newOrder = await createOrder(orderData, { assignOrderNo: false });

        const line_items = items.map((item) => {
            // Determine unit amount: prefer finalPrice, then unitPrice, then compute from price+discount
            let unit = 0;
            if (item.finalPrice !== undefined) unit = Number(item.finalPrice);
            else if (item.unitPrice !== undefined) unit = Number(item.unitPrice);
            else if (item.price !== undefined) {
                const disc = item.discount !== undefined ? Number(item.discount || 0) : 0;
                unit = disc > 0 ? Math.round(Number(item.price) - (Number(item.price) * disc / 100)) : Number(item.price);
            }
            return ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.name + (item.variantName ? ` - ${item.variantName}` : ''),
                        images: item.image ? (Array.isArray(item.image) ? item.image : [item.image]) : []
                    },
                    unit_amount: Math.round(unit * 100)
                },
                quantity: item.quantity
            })
        })

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: 10 * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({ 
            success: true, 
            session_url: session.url,
            orderId: newOrder._id,
            orderNo: newOrder.orderNo
        });

    } catch (error) {
        console.log('Stripe Order Error:', error);
        res.json({ 
            success: false, 
            message: error.message || "Payment failed" 
        });
    }
}

// Verify Stripe - ONLY SUCCESSFUL PAYMENTS CREATE ORDERS
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            // Payment successful - assign per-user orderNo if not already assigned, then update order to paid
            const order = await orderModel.findById(orderId);
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

            if (!order.orderNo) {
                // Atomically increment user's lastOrderNo and assign
                const updatedUser = await userModel.findByIdAndUpdate(userId, { $inc: { lastOrderNo: 1 } }, { new: true });
                if (!updatedUser) return res.status(400).json({ success: false, message: 'User not found when assigning order number' });
                order.orderNo = updatedUser.lastOrderNo;
                console.log('verifyStripe: assigned orderNo', order.orderNo, 'to order', order._id, 'for user', userId);
                await order.save();
            }

            // Mark as paid
            order.payment = true;
            order.status = 'Order Placed';
            await order.save();
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            // send confirmation email with OTP
            try {
                // `order` variable already fetched above
                if (order) {
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    order.confirmationOtp = otp;
                    order.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                    await order.save();

                   const mailHtml = `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #052659 0%, #1a4b8c 100%); padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FRD PREMIUM NUTRIENTS</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
        <h2 style="color: #052659; margin-top: 0;">Order Confirmed! 🎉</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${order.address?.firstName || 'Customer'},</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Thank you for choosing FRD Premium Nutrients! Your order has been successfully placed and is being processed.</p>
        
        <!-- Order Details Box -->
        <div style="background: #f8f9fa; border-left: 4px solid #052659; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #052659; margin-top: 0;">Order Summary</h3>
            <p style="margin: 8px 0;"><strong>Order Number:</strong> #${order.orderNo}</p>
            <p style="margin: 8px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Total Amount:</strong> ₹${order.amount}</p>
            <p style="margin: 8px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <!-- OTP Box -->
        

        <!-- Next Steps -->
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">What's Next?</h4>
            <ul style="color: #856404; padding-left: 20px;">
                <li>Your order will be processed within 24 hours</li>
                <li>You will receive shipping confirmation soon</li>
                <li>Track your order using your account</li>
            </ul>
        </div>
    </div>
    
    <!-- Footer -->
    
</div>
`;
                    // Prefer user email
                    const user = await userModel.findById(order.userId);
                                        const toEmail = (user && user.email) ? user.email : (order.address && order.address.email) ? order.address.email : null;
                                        if (toEmail) await sendMail({ to: toEmail, subject: `Order #${order.orderNo} Confirmation`, html: mailHtml });
                                        else console.log('No customer email available to send stripe confirmation for order', order.orderNo);
                }
            } catch (err) {
                console.log('Error sending order confirmation email (stripe):', err.message || err);
            }

            res.json({ 
                success: true, 
                message: "Payment Successful! Your order has been confirmed." 
            });
        } else {
            // Payment failed - delete the temporary order
            await orderModel.findByIdAndDelete(orderId);
            res.json({ 
                success: false, 
                message: "Payment failed. Order cancelled." 
            });
        }
    } catch (error) {
        console.log('Stripe Verify Error:', error);
        // Error case - delete the order
        try {
            await orderModel.findByIdAndDelete(orderId);
        } catch (deleteError) {
            console.log('Delete order error:', deleteError);
        }
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!items || items.length === 0) {
            return res.json({ 
                success: false, 
                message: "Your cart is empty" 
            });
        }

        // Create temporary order with pending payment
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false, // Initially false
            date: Date.now(),
            status: 'Payment Pending'
        }

        // Create temporary Razorpay order without assigning per-user orderNo yet
        const newOrder = await createOrder(orderData, { assignOrderNo: false });

        // Ensure amount is numeric and compute paise
        const numericAmount = Number(amount) || 0;
        const razorpayAmount = Math.round(numericAmount * 100);
        console.log('placeOrderRazorpay: incoming amount=', amount, 'numeric=', numericAmount, 'razorpayAmount(paise)=', razorpayAmount, 'user=', userId);

        const options = {
            amount: razorpayAmount,
            currency: 'INR',
            receipt: newOrder._id.toString()
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);
        console.log('placeOrderRazorpay: created razorpayOrder', { id: razorpayOrder.id, amount: razorpayOrder.amount, receipt: razorpayOrder.receipt });
        
        res.json({ 
            success: true, 
            order: razorpayOrder,
            orderId: newOrder._id,
            orderNo: newOrder.orderNo,
            key: process.env.RAZORPAY_KEY_ID || null
        });

    } catch (error) {
        console.log('Razorpay Order Error:', error);
        res.json({ 
            success: false, 
            message: error.message || "Payment failed" 
        });
    }
}

// Verify Razorpay - ONLY SUCCESSFUL PAYMENTS CONFIRM ORDERS
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing Razorpay payment verification parameters' });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error('RAZORPAY_KEY_SECRET not set in environment');
            return res.status(500).json({ success: false, message: 'Payment gateway misconfiguration' });
        }

        // Verify signature
        const crypto = await import('crypto');
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            console.warn('Razorpay signature mismatch', { razorpay_order_id, razorpay_payment_id, generated_signature, razorpay_signature });
            // Attempt to delete temporary order if receipt available
            try {
                const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
                if (orderInfo && orderInfo.receipt) await orderModel.findByIdAndDelete(orderInfo.receipt);
            } catch (e) {
                console.warn('Unable to fetch razorpay order to cleanup after signature mismatch', e);
            }
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        // Fetch payment details to ensure it's captured
        const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
        if (!payment) {
            return res.status(400).json({ success: false, message: 'Razorpay payment not found' });
        }

        // Check capture status. 'captured' means successful.
        if (payment.status !== 'captured') {
            // If payment is 'authorized' and auto-capture isn't enabled, try to capture
            if (payment.status === 'authorized') {
                try {
                    await razorpayInstance.payments.capture(razorpay_payment_id, payment.amount);
                } catch (capErr) {
                    console.error('Failed to capture authorized payment', capErr);
                    return res.status(400).json({ success: false, message: 'Payment not captured' });
                }
            } else {
                // delete temporary order if exists
                try {
                    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
                    if (orderInfo && orderInfo.receipt) await orderModel.findByIdAndDelete(orderInfo.receipt);
                } catch (e) {
                    console.warn('Unable to cleanup order after unsuccessful payment status', e);
                }
                return res.status(400).json({ success: false, message: 'Payment not successful' });
            }
        }

        // At this point signature matches and payment is captured - update order
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        const receiptId = orderInfo && orderInfo.receipt ? orderInfo.receipt : null;
        if (!receiptId) {
            return res.status(400).json({ success: false, message: 'Order receipt not found' });
        }

        // Find the temporary order and assign orderNo if missing, then mark paid
        const order = await orderModel.findById(receiptId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (!order.orderNo) {
            const updatedUser = await userModel.findByIdAndUpdate(userId, { $inc: { lastOrderNo: 1 } }, { new: true });
            if (!updatedUser) return res.status(400).json({ success: false, message: 'User not found when assigning order number' });
            order.orderNo = updatedUser.lastOrderNo;
            console.log('verifyRazorpay: assigned orderNo', order.orderNo, 'to order', order._id, 'for user', userId);
        }

        order.payment = true;
        order.status = 'Order Placed';
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // send confirmation email with OTP
        try {
            const order = await orderModel.findById(receiptId);
            if (order) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                order.confirmationOtp = otp;
                order.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                await order.save();


                   const mailHtml = `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #052659 0%, #1a4b8c 100%); padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FRD PREMIUM NUTRIENTS</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
        <h2 style="color: #052659; margin-top: 0;">Order Confirmed! 🎉</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${order.address?.firstName || 'Customer'},</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Thank you for choosing FRD Premium Nutrients! Your order has been successfully placed and is being processed.</p>
        
        <!-- Order Details Box -->
        <div style="background: #f8f9fa; border-left: 4px solid #052659; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #052659; margin-top: 0;">Order Summary</h3>
            <p style="margin: 8px 0;"><strong>Order Number:</strong> #${order.orderNo}</p>
            <p style="margin: 8px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Total Amount:</strong> ₹${order.amount}</p>
            <p style="margin: 8px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <!-- OTP Box -->
        

        <!-- Next Steps -->
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">What's Next?</h4>
            <ul style="color: #856404; padding-left: 20px;">
                <li>Your order will be processed within 24 hours</li>
                <li>You will receive shipping confirmation soon</li>
                <li>Track your order using your account</li>
            </ul>
        </div>
    </div>
    
    <!-- Footer -->
    
</div>
`;
                  const user = await userModel.findById(order.userId);
                const toEmail = (user && user.email) ? user.email : (order.address && order.address.email) ? order.address.email : null;
                if (toEmail) await sendMail({ to: toEmail, subject: `Order #${order.orderNo} Confirmation`, html: mailHtml });
                else console.log('No customer email available to send razorpay confirmation for order', order.orderNo);
            }
        } catch (err) {
            console.log('Error sending order confirmation email (razorpay):', err.message || err);
        }

        return res.json({ success: true, message: 'Payment Successful! Your order has been confirmed.' });

    } catch (error) {
        console.log('Razorpay Verify Error:', error);
        // Do not attempt to delete order here unless we have receipt
        return res.status(500).json({ success: false, message: 'Payment verification failed. Order may be cancelled.' });
    }
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ 
            success: true, 
            orders,
            message: `Found ${orders.length} orders` 
        });
    } catch (error) {
        console.log('All Orders Error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// User Order Data For Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ 
                success: false, 
                message: "User ID is required" 
            });
        }

        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ 
            success: true, 
            orders,
            message: `Found ${orders.length} orders for user` 
        });

    } catch (error) {
        console.log('User Orders Error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Update order status from Admin Panel - DELIVERED = AUTOMATIC PAID
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ 
                success: false, 
                message: "Order ID and status are required" 
            });
        }

        const updateData = { status };
        
        // If status is 'Delivered', automatically mark as paid
        if (status === 'Delivered') {
            updateData.payment = true;
        }

        await orderModel.findByIdAndUpdate(orderId, updateData);
        // After update, if status changed to Delivered, send OTP/confirmation to user
        try {
            if (status === 'Delivered') {
                const order = await orderModel.findById(orderId);
                if (order) {
                    // mark payment true as above
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    order.confirmationOtp = otp;
                    order.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                    await order.save();

                    const user = await userModel.findById(order.userId);
                    const toEmail = (user && user.email) ? user.email : (order.address && order.address.email) ? order.address.email : null;
                                    const mailHtml = `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FRD PREMIUM NUTRIENTS</h1>
        <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 16px;">Your Order Has Been Delivered!</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px; text-align: center;">
        <div style="font-size: 80px; margin: 20px 0;">🎁</div>
        <h2 style="color: #27ae60; margin-top: 0;">Order Delivered Successfully!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${order.address?.firstName || 'Customer'},</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Great news! Your FRD Premium Nutrients order has been delivered.</p>
        
        <!-- Order Details -->
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; display: inline-block; text-align: left;">
            <p style="margin: 8px 0;"><strong>Delivery Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">Delivered</span></p>
        </div>

        <!-- Review CTA -->

    </div>
    
    <!-- Footer -->
    <div style="background: #2c3e50; padding: 20px; text-align: center; color: #ecf0f1;">
        <p style="margin: 0 0 10px 0; font-weight: bold;">Thank you for choosing FRD Premium Nutrients!</p>
        <p style="margin: 5px 0; font-size: 14px;">Premium Quality Supplements for Your Health Journey</p>
    </div>
</div>
`;
                                        if (toEmail) await sendMail({ to: toEmail, subject: `Order #${order.orderNo} Delivered`, html: mailHtml });
                }
            } else if (status === 'Cancelled') {
                const order = await orderModel.findById(orderId);
                if (order) {
                    const cancelOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    order.confirmationOtp = cancelOtp;
                    order.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                    await order.save();

                    const user = await userModel.findById(order.userId);
                    const toEmail = (user && user.email) ? user.email : (order.address && order.address.email) ? order.address.email : null;
                                       const mailHtml = `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FRD PREMIUM NUTRIENTS</h1>
        <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 16px;">Order Cancellation Notice</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 60px; color: #e74c3c;">❌</div>
            <h2 style="color: #e74c3c; margin-top: 0;">Order Cancelled</h2>
        </div>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${order.address?.firstName || 'Customer'},</p>
        
        <!-- Cancellation Details -->
        <div style="background: #fdf2f2; border: 1px solid #fbd5d5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #c53030; margin-top: 0;">Cancellation Details</h4>
            <p style="margin: 8px 0; color: #742a2a;"><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Refund Info -->
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">Refund Information</h4>
            <p style="color: #856404; margin: 5px 0;">If you paid online, your refund will be processed within 5-7 business days.</p>
        </div>

        <!-- Help Section -->
        
    </div>
    
    <!-- Footer -->
    <div style="background: #2c3e50; padding: 20px; text-align: center; color: #ecf0f1;">
        <p style="margin: 0; font-size: 14px;">We hope to serve you better in the future. Thank you for considering FRD Premium Nutrients.</p>
    </div>
</div>
`;
                                        if (toEmail) await sendMail({ to: toEmail, subject: `Order #${order.orderNo} Cancelled`, html: mailHtml });
                }
            }
        } catch (err) {
            console.log('Error sending delivery confirmation email:', err.message || err);
        }

        res.json({ 
            success: true, 
            message: `Order status updated to ${status}` 
        });

    } catch (error) {
        console.log('Update Status Error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Update admin notes for order
const updateNotes = async (req, res) => {
    try {
        const { orderId, adminNotes } = req.body;

        if (!orderId) {
            return res.json({ 
                success: false, 
                message: "Order ID is required" 
            });
        }

        await orderModel.findByIdAndUpdate(orderId, { adminNotes });
        
        res.json({ 
            success: true, 
            message: "Notes updated successfully" 
        });

    } catch (error) {
        console.log('Update Notes Error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Update tracking URL for order
const updateTrackingUrl = async (req, res) => {
    try {
        const { orderId, trackingUrl } = req.body;

        if (!orderId) {
            return res.json({ 
                success: false, 
                message: "Order ID is required" 
            });
        }

                // Normalize tracking URL: ensure it is an absolute URL with protocol
                let normalized = (trackingUrl || '').toString().trim();
                if (normalized) {
                    try {
                        // If it's already a valid absolute URL, this will succeed
                        new URL(normalized);
                    } catch (err) {
                        // Try prefixing with https:// and validate again
                        try {
                            normalized = 'https://' + normalized.replace(/^https?:\/\//i, '');
                            new URL(normalized);
                        } catch (err2) {
                            return res.status(400).json({ success: false, message: 'Invalid tracking URL' });
                        }
                    }
                }

                await orderModel.findByIdAndUpdate(orderId, { trackingUrl: normalized });

                res.json({ 
                        success: true, 
                        message: "Tracking URL updated successfully",
                        trackingUrl: normalized
                });

    } catch (error) {
        console.log('Update Tracking URL Error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Update user notes for order
const updateUserNotes = async (req, res) => {
    try {
        const { orderId, userNotes } = req.body;

        if (!orderId) {
            return res.json({ 
                success: false, 
                message: "Order ID is required" 
            });
        }

        await orderModel.findByIdAndUpdate(orderId, { userNotes });
        
        res.json({ 
            success: true, 
            message: "Special request updated successfully" 
        });

    } catch (error) {
        console.log('Update User Notes Error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// ✅ IMPROVED CANCEL ORDER WITH BETTER EMAIL HANDLING
const cancelOrder = async (req, res) => {
    try {
        const { orderId, userEmail } = req.body;

        console.log('🔍 Cancel Order Request Received:', { orderId, userEmail });

        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            console.log('❌ Order not found:', orderId);
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        // Check if order is already cancelled
        if (order.status === 'Cancelled') {
            console.log('⚠️ Order already cancelled:', orderId);
            return res.status(400).json({ 
                success: false, 
                message: 'Order is already cancelled' 
            });
        }

        // Check if order is already delivered
        if (order.status === 'Delivered') {
            console.log('❌ Cannot cancel delivered order:', orderId);
            return res.status(400).json({ 
                success: false, 
                message: 'Delivered orders cannot be cancelled' 
            });
        }

        // Update order status
        order.status = 'Cancelled';
        await order.save();

        console.log('✅ Order cancelled in database:', orderId);

        // ✅ IMPROVED EMAIL SENDING WITH PROPER ERROR HANDLING
        let emailSent = false;
        let emailError = null;

        try {
            const targetEmail = userEmail || order.address?.email;
            console.log('📧 Attempting to send cancellation email to:', targetEmail);

            // Generate a cancellation confirmation OTP and save on order (so user can confirm if needed)
            const cancelOtp = Math.floor(100000 + Math.random() * 900000).toString();
            order.confirmationOtp = cancelOtp;
            order.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await order.save();
const mailHtml = `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FRD PREMIUM NUTRIENTS</h1>
        <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 16px;">Order Cancellation Notice</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 60px; color: #e74c3c;">❌</div>
            <h2 style="color: #e74c3c; margin-top: 0;">Order Cancelled</h2>
        </div>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${order.address?.firstName || 'Customer'},</p>
        
        <!-- Cancellation Details -->
        <div style="background: #fdf2f2; border: 1px solid #fbd5d5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #c53030; margin-top: 0;">Cancellation Details</h4>
            <p style="margin: 8px 0; color: #742a2a;"><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Refund Info -->
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">Refund Information</h4>
            <p style="color: #856404; margin: 5px 0;">If you paid online, your refund will be processed within 5-7 business days.</p>
        </div>

        <!-- Help Section -->
       
    </div>
    
    <!-- Footer -->
    <div style="background: #2c3e50; padding: 20px; text-align: center; color: #ecf0f1;">
        <p style="margin: 0; font-size: 14px;">We hope to serve you better in the future. Thank you for considering FRD Premium Nutrients.</p>
    </div>
</div>
`;

            // Use centralized sendMail helper and add a timeout wrapper
            const emailPromise = sendMail({
                to: targetEmail,
                subject: `Order #${order.orderNo} Cancellation Confirmation`,
                html: mailHtml
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 10000));
            await Promise.race([emailPromise, timeoutPromise]);
            emailSent = true;
            console.log('✅ Cancellation email sent successfully to:', targetEmail);
        } catch (emailError) {
            console.log('⚠️ Email sending failed, but order was cancelled:', emailError.message);
            emailError = emailError.message;
            // Don't throw error - order is still cancelled successfully
        }

        res.json({ 
            success: true, 
            message: 'Order cancelled successfully' + (emailSent ? ' and email sent' : ' (email failed)'),
            emailSent: emailSent,
            emailError: emailError
        });

    } catch (error) {
        console.error('💥 Cancel Order Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error cancelling order: ' + error.message 
        });
    }
}
// Upload bill image for an order (user or admin)
const uploadBill = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userIdFromToken = req.body.userId; // set by auth middleware if token present

        if (!orderId) return res.status(400).json({ success: false, message: 'Order ID is required' });

        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // If token present, ensure the requester is the owner of the order
        if (userIdFromToken && order.userId && userIdFromToken !== order.userId.toString()) {
            return res.status(403).json({ success: false, message: 'Forbidden: You can only upload bill for your own orders' });
        }

        // Ensure file is present
        if (!req.file) return res.status(400).json({ success: false, message: 'No bill image uploaded' });

        let uploadResult = null;

        // Support both diskStorage (path) and memoryStorage (buffer)
        if (req.file.path) {
            // Use file path
            uploadResult = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
            // try remove temp file if it exists
            try { await unlinkAsync(req.file.path); } catch (e) { /* ignore cleanup errors */ }
        } else if (req.file.buffer) {
            // Upload from buffer
            uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                stream.end(req.file.buffer);
            });
        } else {
            return res.status(400).json({ success: false, message: 'Uploaded file missing path or buffer' });
        }

        if (!uploadResult || !uploadResult.secure_url) {
            return res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
        }

        order.billImage = uploadResult.secure_url;
        order.billUploadedAt = new Date();
        await order.save();

        return res.json({ success: true, message: 'Bill uploaded successfully', billImage: order.billImage, order });
    } catch (err) {
        console.error('Upload bill error:', err);
        return res.status(500).json({ success: false, message: 'Failed to upload bill image' });
    }
};

export {
    verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe,
    placeOrderRazorpay, allOrders, userOrders, updateStatus, cancelOrder, updateNotes, updateUserNotes, updateTrackingUrl, uploadBill
}

// Download bill (force download through server proxy) - allows owner or admin
const downloadBill = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        if (!orderId) return res.status(400).json({ success: false, message: 'orderId query param is required' });

        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (!order.billImage) return res.status(404).json({ success: false, message: 'No bill available for this order' });

        // Determine requester identity from token header (if provided)
        const token = req.headers.token || req.headers.authorization;
        let requesterId = null;
        let requesterIsAdmin = false;
        if (token) {
            try {
                const decoded = jwt.verify(token.toString(), process.env.JWT_SECRET);
                requesterId = decoded.id;
                const user = await userModel.findById(requesterId).select('role');
                if (user && user.role === 'admin') requesterIsAdmin = true;
            } catch (err) {
                // invalid token — just treat as guest
            }
        }

        // Allow if requester is owner or admin
        if (!requesterIsAdmin && (!requesterId || requesterId.toString() !== order.userId.toString())) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const remoteUrl = order.billImage;
        const parsed = new URL(remoteUrl);
        const protocol = parsed.protocol === 'https:' ? https : http;

        protocol.get(remoteUrl, (remoteRes) => {
            if (remoteRes.statusCode !== 200) {
                return res.status(502).json({ success: false, message: 'Failed to fetch remote file' });
            }
            const contentType = remoteRes.headers['content-type'] || 'application/octet-stream';
            let ext = '.jpg';
            if (contentType) {
                const parts = contentType.split('/');
                if (parts[1]) ext = '.' + parts[1].split(';')[0];
            }
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}${ext}`);
            remoteRes.pipe(res);
        }).on('error', (err) => {
            console.error('Error proxying download:', err);
            res.status(500).json({ success: false, message: 'Error downloading file' });
        });

    } catch (err) {
        console.error('Download bill error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

export { downloadBill }

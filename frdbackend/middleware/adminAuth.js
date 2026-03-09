import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token contains a real user id, verify that user exists and is admin
    if (decoded && decoded.id) {
      const user = await UserModel.findById(decoded.id).select('-password');
      if (!user || user.role !== 'admin') {
        return res.status(401).json({
          success: false,
          message: "Not Authorized Login Again"
        });
      }
      req.user = user;
      return next();
    }

    // Fallback: allow env-based admin token (generated when no admin user in DB)
    // Token should include decoded.email and role 'admin' and match ADMIN_EMAIL in env
    if (decoded && decoded.email && decoded.role === 'admin' && process.env.ADMIN_EMAIL && decoded.email === process.env.ADMIN_EMAIL) {
      // Attach a minimal admin-like object so controllers can use req.user.email/role
      req.user = { _id: null, email: process.env.ADMIN_EMAIL, role: 'admin' };
      return next();
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ 
      success: false, 
      message: "Not Authorized Login Again" 
    });
  }
};

export default adminAuth;
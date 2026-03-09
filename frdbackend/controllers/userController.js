import validator from "validator";
import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel.js";
import sendMail from '../utils/mailer.js';

// Password validation function
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const specialChars = password.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/g);
  const hasAtLeastOneSpecialChar = specialChars && specialChars.length >= 1;
  const hasTwoSpecialChars = specialChars && specialChars.length >= 2;

  return {
    // For users: we consider passwords valid with at least one special character.
    // Admin flows explicitly check for two special characters below.
    isValid: minLength && hasUpperCase && hasLowerCase && hasAtLeastOneSpecialChar,
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasAtLeastOneSpecialChar,
    hasTwoSpecialChars,
    specialCharCount: specialChars ? specialChars.length : 0
  };
};

// Helper: Create JWT token
// Accepts either an id string or a user object. If a user object with `role` is
// passed, include role in the token payload so frontends can read it directly.
const createToken = (userOrId) => {
  const payload = {};
  if (userOrId && typeof userOrId === 'object') {
    payload.id = userOrId._id || userOrId.id;
    if (userOrId.role) payload.role = userOrId.role;
  } else {
    payload.id = userOrId;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256'
  });
};

// Admin initialization is handled centrally in server.js via UserModel.ensureAdminExists()

// Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, email and password are required" 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      });
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      let errorMessage = "Password must contain:";
      if (!passwordValidation.minLength) errorMessage += " at least 8 characters,";
      if (!passwordValidation.hasUpperCase) errorMessage += " one uppercase letter,";
      if (!passwordValidation.hasLowerCase) errorMessage += " one lowercase letter,";
      if (!passwordValidation.hasAtLeastOneSpecialChar) errorMessage += " at least one special character,";
      
      errorMessage = errorMessage.slice(0, -1) + '.';
      return res.status(400).json({ 
        success: false, 
        message: errorMessage
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "An account already exists with this email. Please login instead." 
      });
    }

    // Create user as unverified and send OTP for verification
    const newUser = new UserModel({ 
      name, 
      email, 
      password,
      isVerified: false,
      role: 'user'
    });

    const otp = newUser.generateOTP();
    await newUser.save();

    // Send OTP email
    try {
      await sendMail({
        to: newUser.email,
        subject: 'Verify your FRD account - OTP',
        html: `<p>Hello ${newUser.name},</p>
               <p>Your verification code is: <strong>${otp}</strong></p>
               <p>This code will expire in 10 minutes.</p>`
      });
    } catch (mailErr) {
      console.error('Error sending signup OTP email:', mailErr);
      // don't fail registration if email fails; inform client
      return res.status(201).json({
        success: true,
        message: 'Registration created. Failed to send verification email; please contact support.',
        emailSent: false
      });
    }

    res.status(201).json({
      success: true,
      message: "Registration created. OTP sent to email for verification.",
      emailSent: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred during registration. Please try again." 
    });
  }
};

// Verify signup OTP
const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const providedOtp = otp.toString().trim();
  const result = user.verifyOTP(providedOtp);
    if (!result.isValid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    await user.save();
    const token = createToken(user._id);
    return res.json({ success: true, message: 'Email verified', token });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "No account found with this email. Please register first." 
      });
    }
    // Lockout policy
    const MAX_FAILED = 5;
    const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const waitMs = user.lockUntil - Date.now();
      const waitSec = Math.ceil(waitMs / 1000);
      return res.status(423).json({ success: false, message: `Account locked due to multiple failed attempts. Try again in ${waitSec} seconds.` });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      // if reached threshold, lock account
      if (user.failedLoginAttempts >= MAX_FAILED) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        user.failedLoginAttempts = 0; // reset counter after locking
      }
      await user.save();
      return res.status(401).json({ success: false, message: "Incorrect email or password" });
    }
    // on successful login, reset counters
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();
    // Password is valid — issue token immediately (password-based login)
    // This returns a token and user object so clients can complete login without OTP.
    try {
      const token = createToken(user);
      // send back a minimal user object (omit sensitive fields)
      const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role
      };

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: safeUser
      });
    } catch (err) {
      console.error('Error issuing token on login:', err);
      return res.status(500).json({ success: false, message: 'Failed to complete login' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred during login. Please try again." 
    });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password, adminCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Verify admin code from env
    if (!process.env.ADMIN_CODE) {
      console.error('ADMIN_CODE not configured in environment');
      return res.status(500).json({ success: false, message: 'Server misconfiguration' });
    }

    if (!adminCode || adminCode.toString() !== process.env.ADMIN_CODE.toString()) {
      return res.status(401).json({ success: false, message: 'Invalid admin code' });
    }

    // Find or prepare admin user in database
    let adminUser = await UserModel.findOne({ email, role: 'admin' });

    if (!adminUser) {
      console.warn(`Admin account not found in DB for email=${email}`);
      // If env admin matches the provided email, create or promote a user from env credentials
      if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
        let existing = await UserModel.findOne({ email });
        if (existing) {
          existing.role = 'admin';
          existing.password = process.env.ADMIN_PASSWORD || existing.password;
          existing.isVerified = true;
          adminUser = await existing.save();
        } else {
          adminUser = new UserModel({
            name: process.env.ADMIN_NAME || 'FRD Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD || 'Admin@123!!',
            role: 'admin',
            isVerified: true
          });
          await adminUser.save();
        }
      } else {
        return res.status(401).json({ success: false, message: 'Admin account not found' });
      }
    }

    // Verify password using bcrypt
    // Lockout policy for admin as well
    const MAX_FAILED = 5;
    const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    if (adminUser.lockUntil && adminUser.lockUntil > Date.now()) {
      const waitMs = adminUser.lockUntil - Date.now();
      const waitSec = Math.ceil(waitMs / 1000);
      return res.status(423).json({ success: false, message: `Account locked due to multiple failed attempts. Try again in ${waitSec} seconds.` });
    }

    const isPasswordValid = await adminUser.comparePassword(password);
    if (!isPasswordValid) {
      adminUser.failedLoginAttempts = (adminUser.failedLoginAttempts || 0) + 1;
      if (adminUser.failedLoginAttempts >= MAX_FAILED) {
        adminUser.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        adminUser.failedLoginAttempts = 0;
        // Notify site admin/email that an admin account was locked
        (async () => {
          try {
            const notifyTo = process.env.ADMIN_ALERT_EMAIL || process.env.ADMIN_EMAIL || adminUser.email;
            await sendMail({
              to: notifyTo,
              subject: `Admin account locked: ${adminUser.email}`,
              html: `<p>The admin account <strong>${adminUser.email}</strong> was locked due to ${MAX_FAILED} consecutive failed login attempts.</p>
                     <p>Lock expires at: <strong>${adminUser.lockUntil.toISOString()}</strong></p>
                     <p>If this wasn't you, please investigate immediately.</p>`
            });
          } catch (notifyErr) {
            console.error('Failed to send admin lock notification:', notifyErr);
          }
        })();
      }
      await adminUser.save();
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
    // on successful admin password verify, reset counters
    adminUser.failedLoginAttempts = 0;
    adminUser.lockUntil = null;
    await adminUser.save();

  // Optionally skip OTP only when explicitly configured via ADMIN_SKIP_OTP.
  // Do NOT skip by default in development — OTP is enforced unless
  // ADMIN_SKIP_OTP is set to 'true'. This prevents accidental bypasses.
  const skipOtp = process.env.ADMIN_SKIP_OTP === 'true';
    if (skipOtp) {
      // Issue token including role so frontend can show admin features
      const token = createToken(adminUser);
      console.debug && console.debug(`Admin login skipping OTP for ${adminUser.email}`);
      return res.json({ success: true, message: 'Login successful (OTP skipped)', token });
    }

    // Otherwise generate and send an OTP (2FA)
    const otp = adminUser.generateOTP();
    await adminUser.save();

    try {
      await sendMail({
        to: adminUser.email,
        subject: 'FRD admin login OTP',
        html: `<p>Hello ${adminUser.name || 'admin'},</p><p>Your login verification code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
      });
    } catch (mailErr) {
      console.error('Error sending admin login OTP email:', mailErr);
      return res.status(200).json({ success: true, message: 'OTP generated but failed to send email', emailSent: false });
    }

    // Debug: log OTP in non-production for development
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`Generated admin login OTP for ${adminUser.email}: ${otp}`);
    }

    return res.json({ success: true, message: 'OTP sent to admin email. Please verify to complete login.', emailSent: true });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
};

// Change Admin Password
const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const email = req.user.email;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password, new password, and confirmation are required" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "New passwords do not match" 
      });
    }

    // Enhanced password validation for admin (require two special characters)
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid || !passwordValidation.hasTwoSpecialChars) {
      let errorMessage = "Password must contain:";
      if (!passwordValidation.minLength) errorMessage += " at least 8 characters,";
      if (!passwordValidation.hasUpperCase) errorMessage += " one uppercase letter,";
      if (!passwordValidation.hasLowerCase) errorMessage += " one lowercase letter,";
      if (!passwordValidation.hasTwoSpecialChars) errorMessage += " at least two special characters,";
      
      errorMessage = errorMessage.slice(0, -1) + '.';
      return res.status(400).json({ 
        success: false, 
        message: errorMessage
      });
    }

    // Find admin user
    const adminUser = await UserModel.findOne({ email, role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin account not found" 
      });
    }

    // Verify current password using bcrypt
    const isCurrentPasswordValid = await adminUser.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Update password in database
    adminUser.password = newPassword;
    await adminUser.save();

    res.json({
      success: true,
      message: "Admin password changed successfully"
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while changing password. Please try again." 
    });
  }
};

// Change Admin Credentials
const changeAdminCredentials = async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;

    // Validate current password is required
    if (!currentPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password is required" 
      });
    }

    // At least one of newEmail or newPassword must be provided
    if (!newEmail && !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Either new email or new password must be provided" 
      });
    }

    // Get current admin user from token (set by middleware)
    const adminUser = await UserModel.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied" 
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await adminUser.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Validate new email if provided
    if (newEmail && !validator.isEmail(newEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      });
    }

    // Validate new password if provided
    if (newPassword) {
      const passwordValidation = validatePassword(newPassword);
      // Admin credentials change requires two special characters
      if (!passwordValidation.isValid || !passwordValidation.hasTwoSpecialChars) {
        let errorMessage = "Password must contain:";
        if (!passwordValidation.minLength) errorMessage += " at least 8 characters,";
        if (!passwordValidation.hasUpperCase) errorMessage += " one uppercase letter,";
        if (!passwordValidation.hasLowerCase) errorMessage += " one lowercase letter,";
        if (!passwordValidation.hasTwoSpecialChars) errorMessage += " at least two special characters,";
        
        // Remove trailing comma and add period
        errorMessage = errorMessage.slice(0, -1) + '.';
        return res.status(400).json({ 
          success: false, 
          message: errorMessage
        });
      }
    }

    // Check if new email already exists (excluding current admin)
    if (newEmail && newEmail !== adminUser.email) {
      const existingUser = await UserModel.findOne({ email: newEmail });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email address already in use" 
        });
      }
    }

    // Update credentials
    if (newEmail) {
      adminUser.email = newEmail;
    }
    if (newPassword) {
      adminUser.password = newPassword; // Will be hashed by pre-save middleware
    }

    await adminUser.save();

    res.json({
      success: true,
      message: "Admin credentials updated successfully",
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Change credentials error:', error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while updating credentials. Please try again." 
    });
  }
};

// Forgot Password (USER) - send OTP to email for reset verification
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "No account found with this email." 
      });
    }

    // Generate OTP on user model and save
    const otp = user.generateOTP();
    await user.save();

    try {
      await sendMail({
        to: user.email,
        subject: 'FRD password reset code',
        html: `<p>Hello ${user.name || 'user'},</p><p>Your password reset code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
      });
    } catch (mailErr) {
      console.error('Error sending forgot-password OTP email:', mailErr);
      return res.status(200).json({ success: true, message: 'OTP generated but failed to send email', emailSent: false });
    }

    // Debug: in non-production, return the OTP in response to simplify local testing
    const resp = { success: true, message: 'OTP sent to email', emailSent: true };
    if (process.env.NODE_ENV !== 'production') resp.debugOtp = otp;
    return res.json(resp);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred. Please try again later." 
    });
  }
};

// Verify Forgot OTP for regular users and issue reset token
const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const result = user.verifyOTP(otp.toString().trim());
    if (!result.isValid) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`Verify forgot OTP failed for ${email}: user.otp=${user.otp} user.otpExpiry=${user.otpExpiry} result=${JSON.stringify(result)}`);
      }
      return res.status(400).json({ success: false, message: result.message });
    }

    await user.save();

    const resetToken = jwt.sign({ id: user._id, purpose: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.json({ success: true, message: 'OTP verified', resetToken });
  } catch (err) {
    console.error('verifyForgotOtp error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match" 
      });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      let errorMessage = "Password must contain:";
      if (!passwordValidation.minLength) errorMessage += " at least 8 characters,";
      if (!passwordValidation.hasUpperCase) errorMessage += " one uppercase letter,";
      if (!passwordValidation.hasLowerCase) errorMessage += " one lowercase letter,";
      if (!passwordValidation.hasAtLeastOneSpecialChar) errorMessage += " at least one special character,";
      
      errorMessage = errorMessage.slice(0, -1) + '.';
      return res.status(400).json({ 
        success: false, 
        message: errorMessage
      });
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.purpose !== 'password_reset') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid reset token" 
      });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully. You can now login with your new password."
    });
  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Reset token has expired. Please request a new one." 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid reset token" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while resetting password. Please try again." 
    });
  }
};

// Send login OTP (passwordless or 2FA flow)
const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: 'Please provide a valid email' });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = user.generateOTP();
    await user.save();

    try {
      await sendMail({
        to: user.email,
        subject: 'Your FRD login code',
        html: `<p>Hello ${user.name || 'user'},</p>
               <p>Your login code is: <strong>${otp}</strong></p>
               <p>This code will expire in 10 minutes.</p>`
      });
    } catch (mailErr) {
      console.error('Error sending login OTP email:', mailErr);
      return res.status(200).json({ success: true, message: 'OTP generated but failed to send email', emailSent: false });
    }

    return res.json({ success: true, message: 'OTP sent to email', emailSent: true });
  } catch (err) {
    console.error('Send login OTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Verify login OTP and issue token
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const providedOtp = otp.toString().trim();
  const result = user.verifyOTP(providedOtp);
    if (!result.isValid) return res.status(400).json({ success: false, message: result.message });

  await user.save();
  // Include full user object so token can carry role (admin/front-end needs role)
  const token = createToken(user);
    return res.json({ success: true, message: 'OTP verified', token, user: { _id: user._id, name: user.name, email: user.email, isVerified: user.isVerified, role: user.role } });
  } catch (err) {
    console.error('Verify login OTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Auth0 social login (Accepts Auth0 `id_token` from frontend, verifies it against Auth0 JWKS,
// then creates or finds a user in our DB and issues an application JWT.)
// Requires: process.env.AUTH0_DOMAIN and process.env.AUTH0_CLIENT_ID
import jwksRsa from 'jwks-rsa';

const auth0Login = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ success: false, message: 'Missing id_token' });

    if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID) {
      console.error('Auth0 env vars not configured');
      return res.status(500).json({ success: false, message: 'Auth0 not configured on server' });
    }

    // Setup JWKS client
    const client = jwksRsa({
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true
    });

    // Helper to retrieve signing key
    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        const signingKey = key.getPublicKey ? key.getPublicKey() : key.rsaPublicKey;
        callback(null, signingKey);
      });
    };

    // Verify id_token
    const verifyOptions = {
      audience: process.env.AUTH0_CLIENT_ID,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    };

    jwt.verify(id_token, getKey, verifyOptions, async (err, decoded) => {
      if (err) {
        console.error('Auth0 id_token verification failed:', err);
        return res.status(401).json({ success: false, message: 'Invalid id_token' });
      }

      // decoded should contain email, name, sub (Auth0 user id)
      const email = decoded.email;
      const name = decoded.name || decoded.nickname || '';
      if (!email) return res.status(400).json({ success: false, message: 'id_token does not contain email' });

      // Only create or authenticate as normal 'user' (not admin)
      let user = await UserModel.findOne({ email });
      if (!user) {
        // Create a new user record; mark verified because Auth0 already validated email
        user = new UserModel({
          name: name || 'Auth0 User',
          email,
          password: Math.random().toString(36).slice(2), // placeholder; won't be used
          isVerified: true,
          role: 'user'
        });
        await user.save();
      } else {
        // Ensure role remains 'user' for social signups; do not elevate admins
        if (!user.role) user.role = 'user';
        if (!user.isVerified) user.isVerified = true;
        await user.save();
      }

      // Issue our app JWT so frontend can use the existing app auth flow
      const appToken = createToken(user);
      const safeUser = { _id: user._id, name: user.name, email: user.email, isVerified: user.isVerified, role: user.role };
      return res.json({ success: true, message: 'Auth0 login successful', token: appToken, user: safeUser });
    });
  } catch (error) {
    console.error('auth0Login error:', error);
    res.status(500).json({ success: false, message: 'Auth0 login failed' });
  }
};

// Admin forgot-password: require admin code, send OTP to admin email
const forgotPasswordAdmin = async (req, res) => {
  try {
    const { email, adminCode } = req.body;

    if (!process.env.ADMIN_CODE) {
      console.error('ADMIN_CODE not configured in environment');
      return res.status(500).json({ success: false, message: 'Server misconfiguration' });
    }

    if (!adminCode || adminCode.toString() !== process.env.ADMIN_CODE.toString()) {
      return res.status(401).json({ success: false, message: 'Invalid admin code' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

  let user = await UserModel.findOne({ email, role: 'admin' });
    if (!user) {
      // If no admin in DB but email matches env ADMIN_EMAIL, create or promote a user using env creds
      if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
        console.warn('Admin not found in DB but matches ADMIN_EMAIL, creating/updating admin from env');
        let existing = await UserModel.findOne({ email });
        if (existing) {
          existing.role = 'admin';
          existing.password = process.env.ADMIN_PASSWORD || existing.password;
          existing.isVerified = true;
          user = await existing.save();
        } else {
          user = new UserModel({
            name: process.env.ADMIN_NAME || 'FRD Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD || 'Admin@123!!',
            role: 'admin',
            isVerified: true
          });
          await user.save();
        }
      } else {
        return res.status(404).json({ success: false, message: 'Admin account not found' });
      }
    }

    const otp = user.generateOTP();
    await user.save();

    // Debug: log OTP info in non-production to help troubleshoot missing OTP issues
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`Generated OTP for admin ${user.email}: otp=${otp} expiry=${user.otpExpiry}`);
    }

    try {
      await sendMail({
        to: user.email,
        subject: 'FRD admin password reset code',
        html: `<p>Hello ${user.name || 'admin'},</p><p>Your password reset code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
      });
    } catch (mailErr) {
      console.error('Error sending admin forgot OTP email:', mailErr);
      return res.status(200).json({ success: true, message: 'OTP generated but failed to send email', emailSent: false });
    }

    return res.json({ success: true, message: 'OTP sent to admin email', emailSent: true });
  } catch (err) {
    console.error('forgotPasswordAdmin error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Verify admin forgot OTP and issue reset token
const verifyForgotOtpAdmin = async (req, res) => {
  try {
    const { email, otp, adminCode } = req.body;

    if (!process.env.ADMIN_CODE) {
      console.error('ADMIN_CODE not configured in environment');
      return res.status(500).json({ success: false, message: 'Server misconfiguration' });
    }

    if (!adminCode || adminCode.toString() !== process.env.ADMIN_CODE.toString()) {
      return res.status(401).json({ success: false, message: 'Invalid admin code' });
    }

    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

  let user = await UserModel.findOne({ email, role: 'admin' });
    if (!user) {
      // Try to promote/create admin from env if email matches
      if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
        console.warn('Admin account not found during OTP verify — creating/updating admin from env');
        let existing = await UserModel.findOne({ email });
        if (existing) {
          existing.role = 'admin';
          existing.password = process.env.ADMIN_PASSWORD || existing.password;
          existing.isVerified = true;
          user = await existing.save();
        } else {
          user = new UserModel({
            name: process.env.ADMIN_NAME || 'FRD Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD || 'Admin@123!!',
            role: 'admin',
            isVerified: true
          });
          await user.save();
        }
      } else {
        return res.status(404).json({ success: false, message: 'Admin account not found' });
      }
    }

    const result = user.verifyOTP(otp);
    if (!result.isValid) {
      // Debug info to help understand why OTP is failing
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`Verify forgot OTP failed for ${email}: user.otp=${user.otp} user.otpExpiry=${user.otpExpiry} result=${JSON.stringify(result)}`);
      }
      return res.status(400).json({ success: false, message: result.message });
    }

    await user.save();

    const resetToken = jwt.sign({ id: user._id, purpose: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });

    return res.json({ success: true, message: 'OTP verified', resetToken });
  } catch (err) {
    console.error('verifyForgotOtpAdmin error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export {
  loginUser,
  registerUser,
  verifySignupOtp,
  sendLoginOtp,
  verifyLoginOtp,
  auth0Login,
  adminLogin,
  forgotPassword,
  resetPassword,
  changeAdminPassword,
  changeAdminCredentials,
  forgotPasswordAdmin,
  verifyForgotOtp,
  verifyForgotOtpAdmin
};
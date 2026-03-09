import 'dotenv/config'
import connectDB from '../config/mongodb.js'
import UserModel from '../models/userModel.js'

const run = async () => {
  try {
    await connectDB()
    const adminEmail = process.env.ADMIN_EMAIL;
    console.log('Looking up admin with email:', adminEmail)
    const user = await UserModel.findOne({ email: adminEmail }).lean()
    if (!user) {
      console.log('No user found with that email')
      process.exit(0)
    }
    // Print only non-sensitive fields
    const { _id, email, role, isVerified, otp, otpExpiry, otpSentAt, createdAt, updatedAt } = user
    console.log({ _id, email, role, isVerified, otp, otpExpiry, otpSentAt, createdAt, updatedAt })
    process.exit(0)
  } catch (err) {
    console.error('Error inspecting admin:', err)
    process.exit(1)
  }
}

run()

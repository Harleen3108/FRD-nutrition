import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import UserModel from '../models/userModel.js';

const run = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL ;
    const adminPassword = process.env.ADMIN_PASSWORD ;

    console.log(`Using admin email: ${adminEmail}`);

    // Try to find admin by email
    let admin = await UserModel.findOne({ email: adminEmail });

    if (admin) {
      // If user exists but not admin, upgrade
      admin.role = 'admin';
      admin.password = adminPassword; // model pre-save will hash
      admin.isVerified = true;
      await admin.save();
      console.log('Existing user upgraded/updated as admin.');
    } else {
      // Create new admin
      admin = new UserModel({
        name: 'FRD Gym Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true
      });
      await admin.save();
      console.log('Admin user created successfully.');
    }

    console.log('Admin credentials set. Please change the password after login.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting/creating admin:', err);
    process.exit(1);
  }
};

run();

// // mailer-debug.js
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// const config465 = {
//   host: 'smtp.hostinger.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   pool: true,
//   maxConnections: 1,
//   connectionTimeout: 60000,
//   greetingTimeout: 60000,
//   socketTimeout: 60000,
//   logger: true,    // enable nodemailer logger
//   debug: true,     // include SMTP protocol traffic
//   // relax certificate validation only for debugging (remove in production)
//   tls: {
//     rejectUnauthorized: false
//   }
// };

// const config587 = {
//   ...config465,
//   port: 587,
//   secure: false,
//   requireTLS: true,
//   tls: { rejectUnauthorized: false }
// };

// let transporter = nodemailer.createTransport(config465);

// const tryInit = async () => {
//   try {
//     await transporter.verify();
//     console.log('✅ connected 465');
//     return;
//   } catch (e) {
//     console.warn('465 verify failed:', e && e.message ? e.message : e);
//   }

//   transporter = nodemailer.createTransport(config587);
//   try {
//     await transporter.verify();
//     console.log('✅ connected 587');
//   } catch (e2) {
//     console.error('Both verifies failed — last error:', e2 && e2.message ? e2.message : e2);
//   }
// };

// tryInit();

// export default async function sendMail(opts = {}) {
//   const mailOptions = Object.assign({
//     from: `"FRD Nutrition Premium" <${process.env.EMAIL_USER}>`
//   }, opts);

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('SENT:', info);
//     return info;
//   } catch (err) {
//     // print full error object for debugging
//     console.error('sendMail error (full):', err);
//     throw err;
//   }
// }

// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendMail(opts) {
  const info = await transporter.sendMail({
    from: `"FRD Nutrition Premium" <${process.env.EMAIL_USER}>`,
    ...opts,
  });
  return info;
}

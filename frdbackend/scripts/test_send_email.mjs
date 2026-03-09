import 'dotenv/config';
import sendMail from '../utils/mailer.js';

try {
  const to = process.env.EMAIL_USER;
  console.log('Sending test email to', to);
  const res = await sendMail({
    to,
    subject: 'FRD Backend Test Email',
    html: '<p>This is a test email from FRD backend. If you received this, SMTP works.</p>'
  });
  console.log('Send result:', res && res.messageId ? 'sent, messageId=' + res.messageId : res);
} catch (err) {
  console.error('Error sending test email:', err);
  process.exit(1);
}

// import store1 from "../assets/shop.png"; // adjust path if needed
// import store2 from "../assets/store1.jpg"; // adjust path if needed
// import store3 from "../assets/store2.webp"; // adjust path if needed
// import store4 from "../assets/store3.webp"; // adjust path if needed

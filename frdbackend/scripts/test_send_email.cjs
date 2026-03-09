import 'dotenv/config';
import sendMail from '../utils/mailer.js';

(async () => {
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
})();

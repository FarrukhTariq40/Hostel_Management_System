const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  // For development, using Gmail SMTP. In production, use SendGrid, Mailgun, etc.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
    // Alternative: Use SMTP settings
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // auth: {
    //   user: process.env.SMTP_EMAIL,
    //   pass: process.env.SMTP_PASSWORD,
    // },
  });

  // Email options
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL || process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;







const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter for sending emails using Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Function to send an email
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully!' };
  } catch (err) {
    return { success: false, message: 'Failed to send email', error: err.message };
  }
};

module.exports = { sendEmail };

const twilio = require('twilio');
require('dotenv').config();

// Twilio client with environment variables
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to send WhatsApp message
const sendWhatsAppMessage = async (phoneNumber, messageText) => {
  try {

    const response = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: messageText,
    });

    // Return response object with message SID for tracking
    return {
      success: true,
      sid: response.sid,
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

const sendSMSMessage = async (phoneNumber, messageText) => {
  try {
    const response = await twilioClient.messages.create({
      from: process.env.TWILIO_SMS_NUMBER,
      to: phoneNumber,
      body: messageText,
    });

    return {
      success: true,
      sid: response.sid,
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

module.exports = { sendWhatsAppMessage, sendSMSMessage };
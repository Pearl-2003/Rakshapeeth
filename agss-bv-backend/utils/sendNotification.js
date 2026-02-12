const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const sendWhatsApp = async (to, message) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message
    });
  } catch (err) {
    console.error("WhatsApp send failed:", err.message);
  }
};

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_SMS_FROM,
      to,
      body: message
    });
  } catch (err) {
    console.error("SMS send failed:", err.message);
  }
};

module.exports = { sendWhatsApp, sendSMS };

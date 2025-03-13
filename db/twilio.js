require('dotenv').config();
const twilio = require("twilio");

// Sets Twilio env variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

async function sendStatusMessage(phoneNumber, status) {
  let messageBody;

  // Select a message based on the order status
  switch(status) {
    case 'received':
      messageBody = "ForkNGo has received your order. We'll update you shortly with pickup time.";
      break;
    case 'in progress':
      messageBody = "ForkNGo is now preparing your order. It won't be long!";
      break;
    case 'ready for pick-up':
      messageBody = "Good news! Your ForkNGo order is now ready for pickup.";
      break;
    case 'pick up':
      messageBody = "Hope you enjoy your meal! Thank you for visiting us.";
      break;
    default:
      messageBody = "ForkNGo: Your order status has been updated";
  }

  try {
    const message = await client.messages.create({
      body: messageBody,
      from: "+17242020885",
      to: phoneNumber
    });

    console.log(`SMS sent to ${phoneNumber}: ${message.body}`);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

module.exports = { sendStatusMessage };

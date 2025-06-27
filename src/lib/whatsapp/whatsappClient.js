const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let currentQrImage = null;

// ✅ Temporary in-memory storage for user OTP sessions
const userResponses = {};

const startWhatsappClient = () => {
  const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox'],
    },
  });

  // ✅ QR Code generation
  whatsapp.on('qr', async (qr) => {
    currentQrImage = await qrcode.toDataURL(qr);
    console.log("✅ QR code updated.");
  });

  // ✅ WhatsApp is ready
  whatsapp.on('ready', () => {
    console.log("✅ WhatsApp client is ready.");
  });

  // ✅ Message event listener
  whatsapp.on('message', async (message) => {
    const userNumber = message.from.replace(/@c\.us$/, '');

    // Ignore group or broadcast messages
    if (userNumber.includes("@g.us") || userNumber.includes("status@broadcast")) return;

    const userMessage = message.body.trim().toLowerCase();

    // Store OTP session if not already present
    if (!userResponses[userNumber]) {
      userResponses[userNumber] = {};
    }

    const userData = userResponses[userNumber];

    // Respond to "hello" with OTP
    if (userMessage === "hello") {
      const randomOTP = Math.floor(100000 + Math.random() * 900000);
      userData.otp = randomOTP;
      userData.state = "otp_sent";

      await message.reply(`Hello! Your verification code is: *${randomOTP}*`);
      console.log(`📤 Sent OTP ${randomOTP} to ${userNumber}`);
    }
  });

  // ✅ Initialize client
  whatsapp.initialize();
};

// ✅ Getter for QR image (base64)
const getQrImage = () => currentQrImage;

module.exports = {
  startWhatsappClient,
  getQrImage,
};

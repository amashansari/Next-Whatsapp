const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

let qrImagePath = null;

const userResponses = {};

const startWhatsappClient = () => {
  const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox'],
    },
  });

  whatsapp.on('qr', async (qr) => {
    const outputPath = path.join(process.cwd(), 'public', 'whatsapp-qr.png');

    await qrcode.toFile(outputPath, qr);
    qrImagePath = '/whatsapp-qr.png';

    console.log('✅ QR code saved to public/whatsapp-qr.png');
  });

  whatsapp.on('ready', () => {
    console.log('✅ WhatsApp client is ready.');
  });

  whatsapp.on('message', async (message) => {
    const userNumber = message.from.replace(/@c\.us$/, '');

    if (userNumber.includes("@g.us") || userNumber.includes("status@broadcast")) return;

    const userMessage = message.body.trim().toLowerCase();
    if (!userResponses[userNumber]) {
      userResponses[userNumber] = {};
    }

    const userData = userResponses[userNumber];

    if (userMessage === "hello") {
      const randomOTP = Math.floor(100000 + Math.random() * 900000);
      userData.otp = randomOTP;
      userData.state = "otp_sent";

      await message.reply(`Hello! Your verification code is: *${randomOTP}*`);
      console.log(`📤 Sent OTP ${randomOTP} to ${userNumber}`);
    }
  });

  whatsapp.initialize();
};

const getQrImagePath = () => qrImagePath;

module.exports = {
  startWhatsappClient,
  getQrImagePath,
};

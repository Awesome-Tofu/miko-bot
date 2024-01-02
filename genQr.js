const { Client , LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrimage = require('qr-image');
const puppeteer = require('puppeteer');
const { uploadFiles } = require('./session/session.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; 

const puppeteerExecutablePath =
  process.env.NODE_ENV === 'production'
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    : puppeteer.executablePath();

function generateQrCode() {
  return new Promise((resolve, reject) => {
  const client = new Client({
    // ffmpegPath: '/app/vendor/ffmpeg',
    authStrategy: new LocalAuth({ clientId: "miko" }),
    puppeteer: {
      args: ['--no-sandbox',
      '--disable-setuid-sandbox'
    ],
    executablePath: puppeteerExecutablePath,
    headless: true,
    }
  });
    
  client.initialize();
  console.log("Initializing...");

  let qrText;
  let isClientReady = false;

  app.get('/', (req, res) => {
    if (qrText && !isClientReady) {
      // If QR code is available and client is not ready
      fs.readFile('index.html', 'utf8', (err, data) => {
        const qr_code = qrimage.imageSync(qrText, { type: 'svg' });
        const modifiedHTML = data.replace('<div class="loading-animation"></div>', qr_code).replace('<!-- pfp -->', '<img class="github-pfp" src="pfp.gif" alt="GitHub PFP">').replace('Please wait Qr code is being generated', 'Scan the QR code using your WhatsApp app');
        res.send(modifiedHTML);
      });
    } else if (isClientReady) {
      // If client is ready
      fs.readFile('index.html', 'utf8', (err, data) => {
        const modifiedHTML = data.replace('<div class="loading-animation"></div>', '<div class="scanning-complete">Scanning complete ✅</div>').replace('Please wait Qr code is being generated','Scan completed!').replace('setInterval(checkForQRCode, 5000);', 'setInterval(checkForQRCode, 1000);');
        res.send(modifiedHTML);
      });
    } else {
      // If neither QR code nor client is ready
      fs.readFile('index.html', 'utf8', (err, data) => {
        res.send(data);
      });
    }
  });


  app.get('/alive', (req, res) => {
      res.json({status:"I am alive😶‍🌫️👍"});
  });

  client.on('qr', async(text) => {
    qrText = text; // Store the QR code text
    // console.log('QR RECEIVED', qrText);
    // qrcode.generate(qrText, { small: true });
    console.log('Visit the server URL to scan the code');
  });




  client.on('remote_session_saved',async () => {
    console.log('SESSION SAVED');
  })


  client.on('authenticated', async (session) => {
    console.log('WHATSAPP WEB => Authenticated');
  });

  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  client.on('ready', async() => {
      client.destroy();
      isClientReady = true;
      console.log('uploading session to github...');
      await uploadFiles('.wwebjs_auth');
      server.close();
      resolve();
  });




});
}

module.exports = generateQrCode;
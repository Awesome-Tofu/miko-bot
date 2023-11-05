const { Client , RemoteAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
require("dotenv").config();
const qrimage = require('qr-image');
const puppeteer = require('puppeteer');
const fs = require('fs');
//import Commands
const startCommand = require('./commands/start');
const pingCommand = require('./commands/ping');
const helpCommand = require('./commands/help');
const stickerCommand = require('./commands/sticker');
const testCommand = require('./commands/test');
const tlCommand = require('./commands/telegraph');
const trCommand = require('./commands/translate');
const repoCommand = require('./commands/repo');
const gptCommand = require('./commands/gpt');
const bardCommand = require('./commands/bard');
const echoCommand = require('./commands/echo');




const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');




//Code
const app = express();
const port = process.env.PORT || 3000; 

const puppeteerExecutablePath =
  process.env.NODE_ENV === 'production'
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    : puppeteer.executablePath();


mongoose.connect(process.env.MONGODB_URI).then(() => {
const store = new MongoStore({ mongoose: mongoose });
const client = new Client({
  authStrategy: new RemoteAuth({
    store: store,
    backupSyncIntervalMs: 300000
}),
  puppeteer: {
		args: ['--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  executablePath: puppeteerExecutablePath,
	}
});

let qrText;

app.get('/', (req, res) => {
    if (qrText) {
      fs.readFile('index.html', 'utf8', (err, data) => {
      const qr_code = qrimage.imageSync(qrText, { type: 'svg'});
      const modifiedHTML = data.replace('%%svg%%', qr_code);
      res.send(modifiedHTML);
    })
    } else {
      res.send('QR code not available yet. Please try again later.');
    }
  });

client.on('qr', (text) => {
  qrText = text; // Store the QR code text
  console.log('QR RECEIVED', qrText);
  qrcode.generate(qrText, { small: true });
  console.log('Visit the server URL to scan the code');
});



client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', (session) => {
  console.log('WHATSAPP WEB => Authenticated');
});




// Commands here

client.on('message', message => {
    const prefix = '.';
    const body_array = message.body.split(" ");
    const command = body_array[0].replace(prefix,'').toLowerCase();
    if(command === 'start') {
      startCommand(client, message);
    }else if(command=="ping"){
      pingCommand(client, message);
    }else if(command=="help"){
      helpCommand(client, message);
    }else if(command=="sticker"){
      stickerCommand(client, message);
    }else if(command=="test"){
      testCommand(client, message);
    }else if(command=="tl"||command=="telegraph"){
      tlCommand(client, message);
    }else if(command=="tr"){
      trCommand(client, message);
    }else if(command=="repo"){
      repoCommand(client, message);
    }else if(command=="gpt"){
      gptCommand(client, message);
    }else if(command=="bard"){
      bardCommand(client, message);
    }else if(command=="echo"){
      echoCommand(client, message);
    }
  });
  





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



client.initialize();
console.log("Initializing...");
});
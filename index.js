const { Client , LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
require("dotenv").config();
const qrimage = require('qr-image');
const puppeteer = require('puppeteer');
const fs = require('fs'); // Traditional fs
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


//import Commands
const startCommand = require('./commands/start');
const pingCommand = require('./commands/ping');
const helpCommand = require('./commands/help');
const {stickerCommand, animatedCommand} = require('./commands/sticker');
const testCommand = require('./commands/test');
const tlCommand = require('./commands/telegraph');
const trCommand = require('./commands/translate');
const repoCommand = require('./commands/repo');
const {gptCommand,
  gpt5Command} = require('./commands/gpt');
const bardCommand = require('./commands/bard');
const echoCommand = require('./commands/echo');
const imagineCommand = require('./commands/imagine');
const termCommand = require('./commands/term');
const infoCommand = require('./commands/info');
const { AudioDownloadYouTube,
  GetYouTubeInfo 
      } = require('./commands/ytdl');
const videoCommand = require('./commands/video');
const quoteCommand = require('./commands/quotely');
const pasteCommand = require('./commands/paste');
const extractCommand = require('./commands/extract');
const hanimeCommand = require('./commands/hanime');
const instaCommand = require('./commands/insta');
const chatbotCommand = require('./commands/chatbot');
const codeCommand = require('./commands/code');
const enhanceCommand = require('./commands/enhance');
const wantedCommand = require('./commands/wanted');
const ttsCommand = require('./commands/tts');
const ppCommand = require('./commands/pp');
const sauceCommand = require('./commands/sauce');
const tinyCommand = require('./commands/tinyurl');
const rmbgCommand = require('./commands/rmbg');
const carbonCommand = require('./commands/carbon');
const {promoteCommand, demoteCommand, kickCommand, inviteCommand, reportCommand, supportCommand} = require('./commands/group');
const {toanimeCommand, toanime3dCommand} = require('./commands/toanime');










//Code
const app = express();
const port = process.env.PORT || 3000; 

const puppeteerExecutablePath =
  process.env.NODE_ENV === 'production'
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    : puppeteer.executablePath();


const client = new Client({
  ffmpegPath: '/app/vendor/ffmpeg',
  authStrategy: new LocalAuth({ clientId: "client-one" }),
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


app.get('/alive', (req, res) => {
    res.send('I am Alive! 😶‍🌫️👍')
});

client.on('qr', (text) => {
  qrText = text; // Store the QR code text
  console.log('QR RECEIVED', qrText);
  qrcode.generate(qrText, { small: true });
  console.log('Visit the server URL to scan the code');
});




client.on('remote_session_saved',async () => {
  console.log('SESSION SAVED');
})


client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', (session) => {
  console.log('WHATSAPP WEB => Authenticated');
});




// Commands here

client.on('message', async message => {
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
    }else if(command=="gpt5"){
      gpt5Command(client, message);
    }else if(command=="bard"){
      bardCommand(client, message);
    }else if(command=="code"){
      codeCommand(client, message);
    }else if(command=="echo"){
      echoCommand(client, message);
    }else if(command.startsWith('imagine')){
      imagineCommand(client, message);
    }else if(command=="term"){
      termCommand(client, message);
    }else if(command=="info"){
      infoCommand(client, message);
    }else if(command=="audio"){
      AudioDownloadYouTube(client, message);
    }else if(command=="video"){
      videoCommand(client, message);
    }else if(command=="detail"){
      GetYouTubeInfo(client, message);
    }else if(command=="q"||command=="quote"){
      quoteCommand(client, message);
    }else if(command=="paste"){
      pasteCommand(client, message);
    }else if(command=="extract"){
      extractCommand(client, message);
    }else if(command=="hanime"){
      hanimeCommand(client, message);
    }else if(command=="insta"){
      instaCommand(client, message);
    }else if(command=="enhance" || command=="upscale"){
      enhanceCommand(client, message);
    }else if(command=="wanted"){
      wantedCommand(client, message);
    }else if(command=="tts"){
      ttsCommand(client, message);
    }else if(command=="pp"){
      ppCommand(client, message);
    }else if(command=="sauce"){
      sauceCommand(client, message);
    }else if(command=="tiny"){
      tinyCommand(client, message);
    }else if(command=="rmbg"){
      rmbgCommand(client, message);
    }else if(command=="carbon"){
      carbonCommand(client, message);
    }else if(command=="promote"){
      promoteCommand(client, message);
    }else if(command=="demote"){
      demoteCommand(client, message);
    }else if(command=="kick"){
      kickCommand(client, message);
    }else if(command=="invite"){
      inviteCommand(client, message);
    }else if(command=="report"){
      reportCommand(client, message);
    }else if(command=="support"){
      supportCommand(client, message);
    }else if(command=="toanime"){
      toanimeCommand(client, message);
    }else if(command=="toanime3d"){
      toanime3dCommand(client, message);
    }else if(command=="asticker"){
      animatedCommand(client, message);
    }else{
      //else it will run chatbot
      chatbotCommand(client, message);
    }
  });
  




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



client.initialize();
console.log("Initializing...");

const { Client , LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
require("dotenv").config();
const qrimage = require('qr-image');
const puppeteer = require('puppeteer');
const fsPromises = require('fs').promises; // Promises-based fs
const fs = require('fs'); // Traditional fs
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
const imagineCommand = require('./commands/imagine');
const termCommand = require('./commands/term');
const infoCommand = require('./commands/info');
const { AudioDownloadYouTube,
  GetYouTubeInfo 
      } = require('./commands/ytdl');
const videoCommand = require('./commands/video')
const quoteCommand = require('./commands/quotely')




//Code
const app = express();
const port = process.env.PORT || 3000; 

const puppeteerExecutablePath =
  process.env.NODE_ENV === 'production'
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    : puppeteer.executablePath();


const client = new Client({
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
    }else if(command=="bard"){
      bardCommand(client, message);
    }else if(command=="echo"){
      echoCommand(client, message);
    }else if(command=="imagine"){
      imagineCommand(client, message);
    }else if(command=="term"){
      termCommand(client, message);
    }else if(command=="info"){
      infoCommand(client, message)
    }else if(command=="audio"){
      AudioDownloadYouTube(client, message)
    }else if(command=="video"){
      videoCommand(client, message)
    }else if(command=="detail"){
      GetYouTubeInfo(client, message)
    }else if(command=="q"||command=="quote"){
      quoteCommand(client, message)
    }else{
      //else it will run chatbot
      const userMessage = message.body;
      const quotedMsg = await message.getQuotedMessage();
      if(quotedMsg){
      // console.log(`previousMsgAuthor: ${quotedMsg.from} has quoted msg? ${message.hasQuotedMsg}`);
      if (quotedMsg.from =='17868712941@c.us' || quotedMsg.from =='17862330930@c.us' || quotedMsg.from == `${process.env.BOT_NUMBER}@c.us` && message.hasQuotedMsg) {
        // Call the Cleverbot API with the user's reply
        if (message.type == 'sticker'){ 
          const files = await fsPromises.readdir('./chatbotstickers');
            
          const imageFiles = files.filter(file => {
            return ['.png', '.jpg'].includes(path.extname(file).toLowerCase());
          });
          const randomIndex = Math.floor(Math.random() * imageFiles.length);
          const randomImageName = imageFiles[randomIndex];
          var imagePath = path.join(__dirname+'/chatbotstickers/'+ randomImageName);
          const sticker = MessageMedia.fromFilePath(imagePath);
          client.sendMessage(message.from, sticker, { sendMediaAsSticker: true });
        }else{
          const apiUrl = `https://chat.merissabot.me/api/apikey=5715764478-MERISSAPy8wmE0ei5/miko/tofu/message=${encodeURIComponent(userMessage)}`;
          const response = await fetch(apiUrl);
          if (response.ok) {
              const botResponse = await response.json();
              message.reply(botResponse.reply);
              console.log(`User: ${userMessage}\nBot: ${botResponse.reply}`);
          }else{
            message.reply("There was an error while fetching the chatbot api");
          }
        }

      }
    }
    }
  });
  




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



client.initialize();
console.log("Initializing...");

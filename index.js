const { Client , LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
require("dotenv").config();
const qrimage = require('qr-image');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const {
  downloadAndExtractFolderFromGitHub,
  deleteZipFileFromGitHub,
  uploadFolderToGitHub
} = require('./session');


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
const delCommand = require('./commands/del');
const tinyCommand = require('./commands/tinyurl');
const rmbgCommand = require('./commands/rmbg');
const carbonCommand = require('./commands/carbon');
const {promoteCommand, demoteCommand, kickCommand, inviteCommand, reportCommand, supportCommand, idCommand} = require('./commands/group');
const {toanimeCommand, toanime3dCommand} = require('./commands/toanime');
const emojiCommand = require('./commands/emojimix');
const restartCommand = require('./commands/redeploy');
const hbarCommand = require('./commands/hbar');
const pintCommand = require('./commands/pinterest');
const wikiCommand = require('./commands/wiki');


//Code
const app = express();
const port = process.env.PORT || 3000; 

const puppeteerExecutablePath =
  process.env.NODE_ENV === 'production'
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    : puppeteer.executablePath();


const client = new Client({
  // ffmpegPath: '/app/vendor/ffmpeg',
  authStrategy: new LocalAuth({ clientId: "miko" }),
  puppeteer: {
		args: ['--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  executablePath: puppeteerExecutablePath,
	}
});

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
  console.log('QR RECEIVED', qrText);
  qrcode.generate(qrText, { small: true });
  console.log('Visit the server URL to scan the code');

  try {
    console.log("downloading session from github");
    await downloadAndExtractFolderFromGitHub();
  } catch (error) {
    console.log("no session present on github.");
  }
});




client.on('remote_session_saved',async () => {
  console.log('SESSION SAVED');
})


client.on('ready', async() => {
    console.log('Miko bot started successfully!');
    const support_group_id = "120363179001099439@g.us";
    // const inviteCodeg = args.join(' ')
    try {
      client.acceptInvite('E0XzCPRXoip16GVoG9yUV0'); 
      console.log('Joined the group!'); 
    }catch (e) {
      console.log('That invite code seems to be invalid.');
    }
    isClientReady = true;

    try {
      console.log("deleting session from github");
      await deleteZipFileFromGitHub();
      console.log("uploading session to github");
      await uploadFolderToGitHub('.wwebjs_auth.zip');
    } catch (error) {
      console.log("no session to delete on github");
      try {
        console.log("uploading session to github");
        await uploadFolderToGitHub('.wwebjs_auth.zip');
      } catch (error) {
        console.log("deleting session from github");
        await deleteZipFileFromGitHub();
        console.log("uploading session to github");
        await uploadFolderToGitHub('.wwebjs_auth.zip')
      }
    }
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
    }else if(command=="del"){
      delCommand(client, message);
    }else if(command=="emoji"){
      emojiCommand(client, message);
    }else if(command=="restart"){
      restartCommand(client, message);
    }else if(command=="hbar"){
      hbarCommand(client, message);
    }else if(command=="pint"){
      pintCommand(client, message);
    }else if(command=="wiki"){
      wikiCommand(client, message);
    }else if(command=="id"){
      idCommand(client, message);
    }else{
      //else it will run chatbot
      chatbotCommand(client, message);
    }
  });
  

  app.get('/delsession',async(req,res)=>{
    await deleteZipFileFromGitHub();
    res.json({message:"deleted session from github"});
  })

  app.get('/:filename', (req, res) => {
    const requestedFilename = req.params.filename;
    const gifPath = path.resolve(requestedFilename);

    if (fs.existsSync(gifPath)) {
        res.setHeader('Content-Type', 'image/gif');
        res.sendFile(gifPath);
    } else {
        res.status(404).send('File not found');
    }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



client.initialize();
console.log("Initializing...");

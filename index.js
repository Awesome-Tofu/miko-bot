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

  // try {
  //   console.log("downloading session from github");
  //   await downloadAndExtractFolderFromGitHub();
  // } catch (error) {
  //   console.log("no session present on github.");
  //   console.error(error.message);
  // }
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

    // try {
    //   console.log("deleting session from github");
    //   await deleteZipFileFromGitHub();
    //   console.log("uploading session to github");
    //   await uploadFolderToGitHub('.wwebjs_auth.zip');
    // } catch (error) {
    //   console.log("no session to delete on github");
    //   try {
    //     console.log("uploading session to github");
    //     await uploadFolderToGitHub('.wwebjs_auth.zip');
    //   } catch (error) {
    //     console.log("deleting session from github");
    //     await deleteZipFileFromGitHub();
    //     console.log("uploading session to github");
    //     await uploadFolderToGitHub('.wwebjs_auth.zip')
    //   }
    // }
});

client.on('authenticated', (session) => {
  console.log('WHATSAPP WEB => Authenticated');
});




// Commands here

client.on('message', async message => {
  let message_body = message.body;
  const prefix = process.env.PREFIX || '.';
  // const body_array = message_body.split(/\s+/);
  // let command;
  // if (message_body.toLowerCase().startsWith(prefix)) {
  //     command = body_array[0].replace(prefix, '');
  // }else{
  //     command = message_body
  // }
  // let utext = message_body.replace(body_array[0], '').trim();

  if(message_body.startsWith(prefix + 'start')) {
      startCommand(client, message);
  }else if(message_body.startsWith(prefix + "ping")){
      pingCommand(client, message);
  }else if(message_body.startsWith(prefix + "help")){
      helpCommand(client, message);
  }else if(message_body.startsWith(prefix + "sticker")){
      stickerCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "test")){
      testCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "tl") || message_body.startsWith(prefix + "telegraph")){
      tlCommand(client, message);
  }else if(message_body.startsWith(prefix + "tr")){
      trCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "report")){
    reportCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "repo")){
      repoCommand(client, message);
  }else if(message_body.startsWith(prefix + "gpt")){
    gptCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "bard")){
      bardCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "code")){
      codeCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "echo")){
      echoCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + 'imagine')){
      imagineCommand(client, message, prefix, prefix);
  }else if(message_body.startsWith(prefix + "term")){
      termCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "info")){
      infoCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "audio")){
      AudioDownloadYouTube(client, message, prefix);
  }else if(message_body.startsWith(prefix + "video")){
      videoCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "detail")){
      GetYouTubeInfo(client, message, prefix);
  }else if(message_body.startsWith(prefix + "q") || message_body.startsWith(prefix + "quote")){
      quoteCommand(client, message);
  }else if(message_body.startsWith(prefix + "paste")){
      pasteCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "extract")){
      extractCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "hanime")){
      hanimeCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "insta")){
      instaCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "enhance") || message_body.startsWith(prefix + "upscale")){
      enhanceCommand(client, message);
  }else if(message_body.startsWith(prefix + "wanted")){
      wantedCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "tts")){
      ttsCommand(client, message);
  }else if(message_body.startsWith(prefix + "pp")){
      ppCommand(client, message);
  }else if(message_body.startsWith(prefix + "sauce")){
      sauceCommand(client, message);
  }else if(message_body.startsWith(prefix + "tiny")){
      tinyCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "rmbg")){
      rmbgCommand(client, message);
  }else if(message_body.startsWith(prefix + "carbon")){
      carbonCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "promote")){
      promoteCommand(client, message);
  }else if(message_body.startsWith(prefix + "demote")){
      demoteCommand(client, message);
  }else if(message_body.startsWith(prefix + "kick")){
      kickCommand(client, message);
  }else if(message_body.startsWith(prefix + "invite")){
      inviteCommand(client, message);
  }else if(message_body.startsWith(prefix + "support")){
      supportCommand(client, message);
  }else if(message_body.startsWith(prefix + "toanime")){
      toanimeCommand(client, message);
  }else if(message_body.startsWith(prefix + "toanime3d")){
      toanime3dCommand(client, message);
  }else if(message_body.startsWith(prefix + "del")){
      delCommand(client, message);
  }else if(message_body.startsWith(prefix + "emoji")){
      emojiCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "hbar")){
      hbarCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "pint")){
      pintCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "wiki")){
      wikiCommand(client, message, prefix);
  }else if(message_body.startsWith(prefix + "id")){
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

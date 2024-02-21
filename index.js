const { Client, RemoteAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const express = require('express');
require("dotenv").config();
const qrimage = require('qr-image');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

//import Commands
const startCommand = require('./commands/start');
const pingCommand = require('./commands/ping');
const helpCommand = require('./commands/help');
const stickerCommand = require('./commands/sticker');
const tlCommand = require('./commands/telegraph');
const trCommand = require('./commands/translate');
const repoCommand = require('./commands/repo');
const gptCommand = require('./commands/gpt');
const bardCommand = require('./commands/bard');
const echoCommand = require('./commands/echo');
const imagineCommand = require('./commands/imagine');
const { termCommand, evalCommand } = require('./commands/term');
const infoCommand = require('./commands/info');
const { AudioDownloadYouTube,
  GetYouTubeInfo,
  VideoDownloadYouTube
} = require('./commands/ytdl');
const quoteCommand = require('./commands/quotely');
const pasteCommand = require('./commands/paste');
const extractCommand = require('./commands/extract');
const instaCommand = require('./commands/insta');
const { chatbotCommand, chatbottoggleCommand } = require('./commands/chatbot');
const { codeCommand, palmCommand } = require('./commands/code');
const enhanceCommand = require('./commands/enhance');
const wantedCommand = require('./commands/wanted');
const ttsCommand = require('./commands/tts');
const ppCommand = require('./commands/pp');
const sauceCommand = require('./commands/sauce');
const delCommand = require('./commands/del');
const tinyCommand = require('./commands/tinyurl');
const rmbgCommand = require('./commands/rmbg');
const carbonCommand = require('./commands/carbon');
const { promoteCommand, demoteCommand, kickCommand, inviteCommand, reportCommand, revokeCommand, supportCommand, idCommand, tagallCommand } = require('./commands/group');
const { toanimeCommand, toanime3dCommand } = require('./commands/toanime');
const emojiCommand = require('./commands/emojimix');
const hbarCommand = require('./commands/hbar');
const pintCommand = require('./commands/pinterest');
const wikiCommand = require('./commands/wiki');
const ownerCommand = require('./commands/owner');
const drawCommand = require('./commands/draw');
const getpromptCommand = require('./commands/getprompt');
const memeCommand = require('./commands/meme');
const jokeCommand = require('./commands/joke');
const { addsudoCommand, delsudoCommand, listsudoCommand } = require('./commands/sudo');
const truecallerCommand = require('./commands/truecaller');

//Code
const app = express();
const port = process.env.PORT || 3000;

const puppeteerExecutablePath =
  process.env.NODE_ENV === 'production'
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    : puppeteer.executablePath();

mongoose.connect('mongodb+srv://kazuha321:kazuha321@cluster0.oafdfob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    // ffmpegPath: '/app/vendor/ffmpeg',
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000
    }),
    puppeteer: {
      args: ['--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      executablePath: puppeteerExecutablePath,
      headless: true,
    }
  });

  let qrText;
  let isClientReady = false;

  app.get('/', (req, res) => {
    if (qrText && !isClientReady) {
      // If QR code is available and client is not ready
      fs.readFile('index.html', 'utf8', (err, data) => {
        const qr_code = qrimage.imageSync(qrText, { type: 'svg' });
        const modifiedHTML = data.replace('<div class="loading-animation"></div>', qr_code).replace('<!-- pfp -->', '<img class="github-pfp" src="logo.gif" alt="GitHub PFP">').replace('Please wait Qr code is being generated', 'Scan the QR code using your WhatsApp app');
        res.send(modifiedHTML);
      });
    } else if (isClientReady) {
      // If client is ready
      fs.readFile('index.html', 'utf8', (err, data) => {
        const modifiedHTML = data.replace('<div class="loading-animation"></div>', '<div class="scanning-complete">Scanning complete ✅</div>').replace('Please wait Qr code is being generated', 'Scan completed!');
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
    res.json({ status: "I am alive😶‍🌫️👍" });
  });

  client.on('qr', async (text) => {
    qrText = text; // Store the QR code text
    console.log('QR RECEIVED', qrText);
    qrcode.generate(qrText, { small: true });
    console.log('Visit the server URL to scan the code');
  });

  client.on('remote_session_saved', async () => {
    console.log('SESSION SAVED');
  })

  client.on('authenticated', async (session) => {
    console.log('WHATSAPP WEB => Authenticated');
  });

  client.on('ready', async () => {
    console.log('Miko bot started successfully!');
    isClientReady = true;
  });

  // Watcher
  client.on('group_join', async (notification) => {
    // console.log('Group join event', notification);
    const joinedUser = notification.id.participant;
    const chat = await client.getChatById(notification.id.remote);
    const participants = await chat.participants;
    const chatName = chat.name;
    const description = chat.description == undefined ? 'no description' : chat.description;
    const owner = chat.owner._serialized;
    const welcomeMsg = process.env.WELCOME_MSG || 'Welcome to the group';
    const joinMsg = `*${chatName}*\n\nHello @${joinedUser.replace('@c.us', '')}, ${welcomeMsg}\n\n💠 Group Description: ${description}\n\n👤 Members: ${participants.length}\n\n💈 Owner: @${owner.replace('@c.us', '')}`;
    client.sendMessage(notification.id.remote, joinMsg, { mentions: [joinedUser, owner] });
  });

  client.on('group_leave', async (notification) => {
    // console.log(notification);
    const leftUser = notification.id.participant;
    const leaveMsg = `Goodbye @${leftUser.replace('@c.us', '')}!`;
    client.sendMessage(notification.id.remote, leaveMsg, { mentions: [leftUser] });
  });

  // Commands here
  client.on('message', async message => {
    let message_body = message.body;
    const prefix = process.env.PREFIX || '.';

    if (message_body.startsWith(prefix + 'start')) {
      startCommand(client, message);
    } else if (message_body.startsWith(prefix + "ping")) {
      pingCommand(client, message);
    } else if (message_body.startsWith(prefix + "help")) {
      helpCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "sticker")) {
      stickerCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "truecaller")) {
      truecallerCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "tl") || message_body.startsWith(prefix + "telegraph")) {
      tlCommand(client, message);
    } else if (message_body.startsWith(prefix + "tr")) {
      trCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "revoke")) {
      revokeCommand(client, message);
    } else if (message_body.startsWith(prefix + "report")) {
      reportCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "repo")) {
      repoCommand(client, message);
    } else if (message_body.startsWith(prefix + "gpt")) {
      gptCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "bard")) {
      bardCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "code")) {
      codeCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "echo")) {
      echoCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + 'imagine')) {
      imagineCommand(client, message, prefix, prefix);
    } else if (message_body.startsWith(prefix + "term")) {
      termCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "eval")) {
      evalCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "info")) {
      infoCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "song")) {
      AudioDownloadYouTube(client, message, prefix);
    } else if (message_body.startsWith(prefix + "video")) {
      VideoDownloadYouTube(client, message, prefix);
    } else if (message_body.startsWith(prefix + "detail")) {
      GetYouTubeInfo(client, message, prefix);
    } else if (message_body.startsWith(prefix + "q") || message_body.startsWith(prefix + "quote")) {
      quoteCommand(client, message);
    } else if (message_body.startsWith(prefix + "paste")) {
      pasteCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "palm")) {
      palmCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "extract")) {
      extractCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "insta")) {
      instaCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "enhance") || message_body.startsWith(prefix + "upscale")) {
      enhanceCommand(client, message);
    } else if (message_body.startsWith(prefix + "wanted")) {
      wantedCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "tts")) {
      ttsCommand(client, message);
    } else if (message_body.startsWith(prefix + "pp")) {
      ppCommand(client, message);
    } else if (message_body.startsWith(prefix + "sauce")) {
      sauceCommand(client, message);
    } else if (message_body.startsWith(prefix + "tiny")) {
      tinyCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "rmbg")) {
      rmbgCommand(client, message);
    } else if (message_body.startsWith(prefix + "carbon")) {
      carbonCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "promote")) {
      promoteCommand(client, message);
    } else if (message_body.startsWith(prefix + "demote")) {
      demoteCommand(client, message);
    } else if (message_body.startsWith(prefix + "kick")) {
      kickCommand(client, message);
    } else if (message_body.startsWith(prefix + "invite")) {
      inviteCommand(client, message);
    } else if (message_body.startsWith(prefix + "support")) {
      supportCommand(client, message);
    } else if (message_body.startsWith(prefix + "toanime")) {
      toanimeCommand(client, message);
    } else if (message_body.startsWith(prefix + "toanime3d")) {
      toanime3dCommand(client, message);
    } else if (message_body.startsWith(prefix + "emoji")) {
      emojiCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "hbar")) {
      hbarCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "pint")) {
      pintCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "wiki")) {
      wikiCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "id")) {
      idCommand(client, message);
    } else if (message_body.startsWith(prefix + "addsudo")) {
      addsudoCommand(client, message);
    } else if (message_body.startsWith(prefix + "delsudo")) {
      delsudoCommand(client, message);
    } else if (message_body.startsWith(prefix + "sudos")) {
      listsudoCommand(client, message);
    } else if (message_body.startsWith(prefix + "del")) {
      delCommand(client, message);
    } else if (message_body.startsWith(prefix + "chatbot")) {
      chatbottoggleCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "owner")) {
      ownerCommand(client, message);
    } else if (message_body.startsWith(prefix + "draw")) {
      drawCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "getprompt")) {
      getpromptCommand(client, message);
    } else if (message_body.startsWith(prefix + "meme")) {
      memeCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "joke")) {
      jokeCommand(client, message, prefix);
    } else if (message_body.startsWith(prefix + "tagall")) {
      tagallCommand(client, message);
    } else {
      //else it will run chatbot
      chatbotCommand(client, message);
    }
  });


  app.get('/logo.gif', (req, res) => {
    const gifPath = path.resolve('logo.gif');

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

  client.on("auth_failure", () => {
    console.error(
      "There is a problem in authentication, Kindly set the env var again and restart the app"
    );
  });

  client.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
  });
});

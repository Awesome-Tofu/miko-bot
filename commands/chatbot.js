const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
const fsPromises = require('fs').promises; // Promises-based fs
const path = require('path');
const { error } = require('console');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI;

async function chatbotCommand(client, message) {
  const chatId = message.from;
  const chatbotEnabled = await isChatbotEnabled(chatId);
  if (chatbotEnabled) {
      const userMessage = message.body;
      const quotedMsg = await message.getQuotedMessage();
      const chat = await message.getChat();
      if ((chat.isGroup === false && message.body) || (quotedMsg && quotedMsg.from == `${process.env.BOT_NUMBER}@c.us` && message.hasQuotedMsg)) {
        // If message type is sticker, send a random sticker from the chatbotstickers folder
        if (message.type == 'sticker'){ 
          const files = await fsPromises.readdir('./commands/chatbotstickers');
            
          const imageFiles = files.filter(file => {
            return ['.png', '.jpg'].includes(path.extname(file).toLowerCase());
          });
          const randomIndex = Math.floor(Math.random() * imageFiles.length);
          const randomImageName = imageFiles[randomIndex];
          var imagePath = path.join(__dirname+'/chatbotstickers/'+ randomImageName);
          const sticker = MessageMedia.fromFilePath(imagePath);
          client.sendMessage(message.from, sticker, { sendMediaAsSticker: true });
        }else{
          await chat.sendStateTyping();
          // If message type is not sticker, send a reply from the chatbot api
          let apiUrl;
          const charai_token = process.env.CHARAI_TOKEN;
          if(charai_token) {
            let id;
            if (!chat.isGroup) {
                id = message.id.remote;
            }else {
                id = message.id.participant;
            }
            apiUrl = `https://tofuapi.onrender.com/char_ai/${charai_token}/aRIvgfWA4uaXxB2wMPsvvBQDbsU5XfPsM0u60ThlDls/${id}/${encodeURIComponent(userMessage)}`;
          }else{
            console.log('No CharAI token found');
            apiUrl = `https://tofuapi.onrender.com/cleverbot/${encodeURIComponent(userMessage)}`;
          }
          const response = await fetch(apiUrl);
          if (response.ok) {
              const botResponse = await response.json();
              const trResponse = await fetch(`https://translate-api-gray.vercel.app/translate?q=${encodeURIComponent(botResponse.reply)}`);
              const translationData = await trResponse.json();
              if (translationData.from && (translationData.from.toLowerCase() === 'hi' || translationData.from.toLowerCase() === 'en')) {
                // If the source language is already English or Hindi, return the query itself
                await message.reply(botResponse.reply);
              }else{
                try{
                    const translatedText = translationData.text;
                    message.reply(translatedText);
                } catch (error) {
                    console.error('Error translating text:', error.message);
                }
              }
              console.log(`User: ${userMessage}\nBot: ${botResponse.reply}`);
          }else{
            console.error('Chatbot API error'+ `\n\n${error.message}`);
          }
        }

      }
  }
}


async function chatbottoggleCommand(waclient, message, prefix) {
  const client = new MongoClient(uri);
  const chatId = message.from;
  const command = message.body.split(prefix + "chatbot")[1].trim();
  const chat = await message.getChat();
  if (chat.isGroup) {
      const authorId = message.id.participant;
      const isAdmin = chat.participants.find((participant) => {
      return participant.id._serialized === authorId && participant.isAdmin;
      });
      if (!isAdmin) {
          message.reply('Only admins can use this command.');
          return;
      }
  }

  try {
      await client.connect();
      const collection = client.db("Chatbot").collection("chats");
      if (command === 'on') {
          await collection.updateOne({ chatId: chatId }, { $set: { chatbotEnabled: true } }, { upsert: true });
          message.reply('Chatbot enabled for this chat.');
      } else if (command === 'off') {
          await collection.updateOne({ chatId: chatId }, { $set: { chatbotEnabled: false } }, { upsert: true });
          message.reply('Chatbot disabled for this chat.');
      } else {
          const chatbotStatus = await collection.findOne({ chatId: chatId });
          if (chatbotStatus) {
              if (chatbotStatus.chatbotEnabled) {
                  message.reply('Chatbot is currently enabled for this chat.');
              } else {
                  message.reply('Chatbot is currently disabled for this chat.');
              }
          } else {
              if (process.env.CHATBOT === 'true') {
                  message.reply('Chatbot is currently enabled by default.');
              } else {
                  message.reply('Chatbot is currently disabled by default.');
              }
          }
      }
  } catch (error) {
      console.error(error);
      message.reply(`⚠️ Error:\n${error.message}`);
  } finally {
      await client.close();
  }
}

async function isChatbotEnabled(chatId) {
  const client = new MongoClient(uri);
  try {
      await client.connect();
      const collection = client.db("Chatbot").collection("chats");
      const chatbotStatus = await collection.findOne({ chatId: chatId });
      if (chatbotStatus) {
          return chatbotStatus.chatbotEnabled;
      } else {
          return process.env.CHATBOT || true;
      }
  } catch (error) {
      console.error(error);
      return false;
  } finally {
      await client.close();
  }
}

module.exports = {
    chatbotCommand,
    chatbottoggleCommand
};
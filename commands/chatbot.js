const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
const fsPromises = require('fs').promises; // Promises-based fs
const path = require('path');
const { error } = require('console');
require('dotenv').config();

module.exports = async function chatbotCommand(client, message) {
      const userMessage = message.body;
      const quotedMsg = await message.getQuotedMessage();
      const chat = await message.getChat();
      if(quotedMsg){
      if (quotedMsg.from == `${process.env.BOT_NUMBER}@c.us` && message.hasQuotedMsg) {
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
            apiUrl = `https://tofuapi.onrender.com/char_ai/${charai_token}/tLF2Fj65fLCELkHYH2TSTdC1RN1tynbvfRv8VwllARw/${id}/${encodeURIComponent(userMessage)}`;
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

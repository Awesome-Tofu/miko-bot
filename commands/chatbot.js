const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
const fsPromises = require('fs').promises; // Promises-based fs
const path = require('path');


module.exports = async function chatbotCommand(client, message) {
      const userMessage = message.body;
      const quotedMsg = await message.getQuotedMessage();
      if(quotedMsg){
      if (quotedMsg.from == `${process.env.BOT_NUMBER}@c.us` && message.hasQuotedMsg) {
        // Call the Cleverbot API with the user's reply
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
        //   const apiUrl = `https://chat.merissabot.me/api/apikey=5715764478-MERISSAPy8wmE0ei5/miko/tofu/message=${encodeURIComponent(userMessage)}`;
          const apiUrl = `https://api.yanzbotz.my.id/api/ai/characterai?text=${encodeURIComponent(userMessage)}&name=Yandere%20Hatsune%20Miku`;
          const response = await fetch(apiUrl);
          if (response.ok) {
              const botResponse = await response.json();
              const trResponse = await fetch(`https://translate-api-gray.vercel.app/translate?q=${encodeURIComponent(botResponse.result)}`);
              const translationData = await trResponse.json();
              if (translationData.from && (translationData.from.toLowerCase() === 'hi' || translationData.from.toLowerCase() === 'en')) {
                // If the source language is already English or Hindi, return the query itself
                message.reply(botResponse.result);
              }else{
                try{
                    const translatedText = translationData.text;
                    message.reply(translatedText);
                } catch (error) {
                    console.error('Error translating text:', error.message);
                }
              }
              console.log(`User: ${userMessage}\nBot: ${botResponse.result}`);
          }else{
            // message.reply("Hello, I can hear your sharp breaths~");
            // chat.sendMessage('1786
            console.error('Chatbot API error');
          }
        }

      }
    }
}

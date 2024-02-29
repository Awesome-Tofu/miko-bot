const axios = require("axios");
const { MessageMedia } = require('whatsapp-web.js');
const fs = require("fs").promises;
const normalfs = require("fs");

module.exports = async function enhanceCommand(client, message) {
  try{
    // message.delete(true);
    if (message.hasQuotedMsg) {
        let quotedMsg = await message.getQuotedMessage();
        let attachmentData = await quotedMsg.downloadMedia();
        normalfs.writeFileSync('./commands/images/input.png', attachmentData.data, 'base64');
        const enhancing = await message.reply(`Enhancing...`);
        const attachmentData2 = await fs.readFile('./commands/images/input.png');
        const base64Data = Buffer.from(attachmentData2).toString('base64');
        const enhanceAPI = 'https://api.qewertyy.dev/upscale';
        const response = await axios.post(enhanceAPI, {image_data: base64Data}, {responseType: 'arraybuffer', responseEncoding: 'binary'});
        await fs.writeFile('./commands/images/enhanced.png', response.data);
        
        const media = await MessageMedia.fromFilePath('./commands/images/enhanced.png');
        await client.sendMessage(message.from, media, {caption: "*Enhanced image*", sendMediaAsDocument: true});
        await enhancing.delete(true);
      
      } else {
        await message.reply("*Error*\n```Please reply to a media file```");
      }
  }catch(error){
    await message.reply("*Error*\n```"+error+"```");
    console.error(error)
  } 

}

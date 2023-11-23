const axios = require("axios");
const FormData = require("form-data");
let mime = require("mime-to-extensions");
const { MessageMedia } = require('whatsapp-web.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));



async function telegraph(attachmentData) {
    let form = new FormData();
    form.append("file", Buffer.from(attachmentData.data, "base64"), {
      filename: `telegraph.${mime.extension(attachmentData.mimetype)}`,
    });
  
    return axios
      .create({
        headers: form.getHeaders(),
      })
      .post("https://te.legra.ph/upload", form)
      .then((response) => {
        return "https://te.legra.ph" + response.data[0].src;
      })
      .catch((error) => {
        return "error";
      });
  }


async function toanimeCommand(client, message) {
  try{
    message.delete(true);
    if (message.hasQuotedMsg) {
        let quotedMsg = await message.getQuotedMessage();
        let attachmentData = await quotedMsg.downloadMedia();
        let data = await telegraph(attachmentData);
        if (data == "error") {
          quotedMsg.reply(`Error occured while creating direct link.`);
        } else {
          await message.reply('please wait while imagine is being converted');
          const response = await fetch(`https://api.betabotz.org/api/maker/jadianime?url=${data}&apikey=GK5zaGhL`);
          const data2 = await response.json();
        //   console.log(data2.result.img_crop_single);
          const media = await MessageMedia.fromUrl(`${data2.result.img_crop_single}`, {type: 'image/jpg'});
          await client.sendMessage(message.from, media, {caption: "Converted Image to Anime"});
        }
      } else {
        await client.sendMessage(message.from, "*Error*\n```Please reply to a media file```");
      }
  }catch(error){
    await message.reply("*Error*\n```something went wrong!```")
  } 

}


async function toanime3dCommand(client, message) {
    try{
      message.delete(true);
      if (message.hasQuotedMsg) {
          let quotedMsg = await message.getQuotedMessage();
          let attachmentData = await quotedMsg.downloadMedia();
          let data = await telegraph(attachmentData);
          if (data == "error") {
            quotedMsg.reply(`Error occured while creating direct link.`);
          } else {
            await message.reply('please wait while imagine is being converted');
            const response = await fetch(`https://api.betabotz.org/api/maker/jadianime3d?url=${data}&apikey=GK5zaGhL`);
            const data2 = await response.json();
            const media = await MessageMedia.fromUrl(`${data2.result.output.fileUrl}`, {type: 'image/jpg'});
            await client.sendMessage(message.from, media, {caption: "Converted Image to 3d Anime"});
          }
        } else {
          await client.sendMessage(message.from, "*Error*\n```Please reply to a media file```");
        }
    }catch(error){
      await message.reply("*Error*\n```something went wrong!```")
    } 
  
  }

module.exports = {
    toanimeCommand,
    toanime3dCommand
};
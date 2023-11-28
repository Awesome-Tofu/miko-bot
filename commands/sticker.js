const { MessageMedia } = require('whatsapp-web.js');
const mp42webpFile = require('../utils/mp42webp');
const axios = require("axios");
const FormData = require("form-data");
let mime = require("mime-to-extensions");




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


async function animatedCommand(client, message) {
  try{
    if (message.hasQuotedMsg) {
        let quotedMsg = await message.getQuotedMessage();
        let attachmentData = await quotedMsg.downloadMedia();
        let data = await telegraph(attachmentData);
        if (data == "error") {
          quotedMsg.reply(`Error occured while create direct link.`);
        } else {

          const webpFile = await mp42webpFile(data, '/commands/webps/output_image.webp');
          console.log(webpFile);
          const sticker = await MessageMedia.fromFilePath(`${__dirname}/webps/output_image.webp`);
          await client.sendMessage(message.from, sticker, { sendMediaAsSticker: true });          
        }
      } else {
        await message.reply("*Error*\n```Please reply to a GIF file```");
      }
  }catch(error){
    await message.reply("*Error*\n```something went wrong!```");
    console.error(error);
  } 

}


async function stickerCommand(client, message) {
    // message.delete(true);
    let quotedMsg = await message.getQuotedMessage();
    try{
        if (quotedMsg.hasMedia == true) {
            if (quotedMsg.isGif == false){
            let attachmentData = await quotedMsg.downloadMedia();
            await client.sendMessage(
            message.from,
            new MessageMedia(
            attachmentData.mimetype,
            attachmentData.data,
            attachmentData.filename
            ),
            { sendMediaAsSticker: true }
      );
    }
    } else {
      await client.sendMessage(
        message.from,
        `🙇‍♂️ *Error*\n\n` + "```No image found to make a Sticker```"
      );
    }
}catch (error){
    message.reply(`🙇‍♂️ *Error*\n\n` + "```Please reply to an image```")
}
    
}


module.exports = {
  stickerCommand,
  animatedCommand
}
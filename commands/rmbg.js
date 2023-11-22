const axios = require("axios");
const FormData = require("form-data");
let mime = require("mime-to-extensions");
const { MessageMedia } = require('whatsapp-web.js');



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


module.exports = async function rmbgCommand(client, message) {
  try{
    message.delete(true);
    if (message.hasQuotedMsg) {
        let quotedMsg = await message.getQuotedMessage();
        let attachmentData = await quotedMsg.downloadMedia();
        let data = await telegraph(attachmentData);
        if (data == "error") {
          quotedMsg.reply(`Error occured while create direct link.`);
        } else {
          const rmbgAPI = 'https://api.yanzbotz.my.id/api/tools/removebg?url='
          const media = await MessageMedia.fromUrl(`${rmbgAPI}${data}`, {unsafeMime: true});
          media.mimetype = 'image/png';
          media.filename = "rmbg.png"
          await client.sendMessage(message.from, media, {caption: "*Background removed image*", sendMediaAsDocument: true});
        }
      } else {
        await client.sendMessage(message.from, "*Error*\n```Please reply to a media file```");
      }
  }catch(error){
    await message.reply("*Error*\n```Can't support text!```");
  } 

}
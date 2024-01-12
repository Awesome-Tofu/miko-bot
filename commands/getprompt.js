const axios = require("axios");
const FormData = require("form-data");
let mime = require("mime-to-extensions");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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


module.exports = async function getpromptCommand(client, message) {
  try{
    // message.delete(true);
    if (message.hasQuotedMsg) {
        let quotedMsg = await message.getQuotedMessage();
        let attachmentData = await quotedMsg.downloadMedia();
        let data = await telegraph(attachmentData);
        if (data == "error") {
          quotedMsg.reply(`Error occured while create direct link.`);
        } else {
            const processing = await message.reply(`*Processing...*`);
            const img2promptAPI = 'https://image2prompt.cyclic.app/generate?imageUrl='
            const resp = await fetch(img2promptAPI + data);
            const respData = await resp.json();
            const prompt = respData.output;
            await processing.edit(prompt);
        }
      } else {
        await client.sendMessage(message.from, "*Error*\n```Please reply to a media file```");
      }
  }catch(error){
    await message.reply("*Error*\n```" + error + "```");
  } 

}
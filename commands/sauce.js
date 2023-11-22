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

  async function shortenVideoUrl(videoUrl) {
    try {
      const response = await axios.get('https://api.erdwpe.com/api/linkshort/tinyurl', {
        params: {
          link: videoUrl,
        },
      });
  
      if (response.data.status === true) {
        // Return the shortened URL if the request is successful
        return response.data.result;
      } else {
        // Handle the case where the API request was not successful
        console.error('TinyURL API request failed:', response.data);
        return null;
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error shortening URL:', error);
      return null;
    }
  }


module.exports = async function sauceCommand(client, message) {
  try{
    message.delete(true);
    if (message.hasQuotedMsg) {
        let quotedMsg = await message.getQuotedMessage();
        let attachmentData = await quotedMsg.downloadMedia();
        let tdata = await telegraph(attachmentData);
        if (tdata == "error") {
          quotedMsg.reply(`Error occured while create direct link.`);
        } else {
          const response = await fetch(`https://api.betabotz.org/api/webzone/whatanime?query=${tdata}&apikey=GK5zaGhL`);
          const jdata = await response.json();
          const name = jdata.result.data.filename.replace('.mp4','');
          const episode = jdata.result.data.episode;
          const image = jdata.result.data.image;
          const video = jdata.result.data.video;
  
          const tinyurl = await shortenVideoUrl(video);
          const caption = `Name: *${name}*\nEpisode: *${episode}*\nvideo: *${tinyurl}*`

          try{
            const media = await MessageMedia.fromUrl(image, { type: 'video/mp4' });
            await client.sendMessage(message.from, media, {caption:caption});
          }catch(error){
            message.reply("error while sending video")
          }
        }
      } else {
        await message.reply("*Error*\n```Please reply to a media file```");
      }
  }catch(error){
    await message.reply("*Error*\n```Can't support text!```")
  } 

}
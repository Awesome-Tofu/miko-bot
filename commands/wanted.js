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

module.exports = async function wantedCommand(client, message, prefix) {
  try {
    if (message.hasQuotedMsg) {
      let quotedMsg = await message.getQuotedMessage();
      let attachmentData = await quotedMsg.downloadMedia();
      let telegraphImageUrl = await telegraph(attachmentData);

      if (telegraphImageUrl === "error") {
        quotedMsg.reply(`Error occurred while creating a direct link.`);
      } else {
        await quotedMsg.reply("Generating..")
        // Extracting name and bounty from the message
        const regex = new RegExp(`^\\${prefix}wanted "(.+)" (\\d+)$`);
        const match = message.body.match(regex);

        if (match) {
          const name = match[1];
          const bounty = match[2];

          // Constructing the URL with parameters
          const wantedAPI = `https://one-piece-wanted.onrender.com/generate-poster?image_source=${telegraphImageUrl}&first_name=${encodeURIComponent(name)}&last_name=%E2%80%8E%20&bounty_amount=${bounty}`;

          // Fetching the enhanced image
          const media = await MessageMedia.fromUrl(wantedAPI, { unsafeMime: true });
          await client.sendMessage(message.from, media);
        } else {
          // Invalid command format
          message.reply(`Invalid command format. Please use: ${prefix}wanted "Name" Bounty\n*Example*\n${prefix}wanted "Monkey D Luffy" 300000`);
        }
      }
    } else {
      await client.sendMessage(message.from, "*Error*\n```Please reply to a media file```");
    }
  } catch (error) {
    console.error(error);
    await message.reply("*Error*\n```An error occurred while processing the command. Please try again later```");
  }
};

const axios = require("axios");
const { MessageMedia } = require('whatsapp-web.js');

async function pinterest(query) {
  const apiUrl = `https://pinterest-api-one.vercel.app/?q=${query}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Pinterest API Error:", error);
    return null;
  }
}

module.exports = async function pintCommand(client, message, prefix) {
  try {
    // Extracting query from the message
    const regex = new RegExp(`^\\${prefix}pint (.+)$`);
    const match = message.body.match(regex);

    if (match) {
      const query = match[1];

      // Fetching Pinterest data
      const pinterestData = await pinterest(query);

      if (pinterestData && pinterestData.images && pinterestData.images.length > 0) {
        const images = pinterestData.images;
        await message.reply(`*${pinterestData.count}* images found`)
        // Sending each image one by one
        for (const imageUrl of images) {
          const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });
          await message.reply(media);
        }
      } else {
        // No images found or an error occurred
        message.reply(`No images found for "${query}" or an error occurred.`);
      }
    } else {
      // Invalid command format
      message.reply(`Invalid command format. Please use: ${prefix}pint "Query"`);
    }
  } catch (error) {
    console.error("Command Error:", error);
    message.reply("An error occurred while processing the command.", `\n${error.message}`);
  }
};

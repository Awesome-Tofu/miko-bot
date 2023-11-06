


import neko from 'commands/images/nekos.js';


module.exports = async function nekoCommand(client, message) {
       const media_url = Math.floor(Math.random() * neko.length);
       const randomUrl = urls[randomIndex];
       const media = await MessageMedia.fromUrl(media_url);
       client.sendMessage(message.from, media, { sendVideoasgif: true});
}

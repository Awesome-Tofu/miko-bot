


import neko from 'commands/images/nekos.js';


module.exports = async function nekoCommand(client, message) {
       const randomIndex = Math.floor(Math.random() * neko.length);
       const media_url = neko[randomIndex];
       const media = await MessageMedia.fromUrl(media_url);
       client.sendMessage(message.from, media, { sendVideoasgif: true});
}

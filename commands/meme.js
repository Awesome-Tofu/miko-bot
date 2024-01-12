const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const gif2mp4File = require('../utils/gif2mp4');

module.exports = async function memeCommand(client, message, prefix) {
    const utext = message.body.split(prefix + "meme")[1];
    let memeapi = 'https://meme-api.com/gimme/';
    try {
        if(utext.trim()){
            memeapi = memeapi + utext.trim();
        }

        console.log(memeapi);
        const response = await axios.get(memeapi);
        const data = response.data;
        const mediaUrl = data.url;
        console.log(data);
        if (mediaUrl.endsWith('.gif')){
            const result = await gif2mp4File(mediaUrl);
            const media = await MessageMedia.fromUrl(result.result, {unsafeMime: true});
            console.log(result.result);
            client.sendMessage(message.from, media, {
                caption: data.title,
                sendVideoAsGif: true
            });
        }else{
            const media = await MessageMedia.fromUrl(mediaUrl);
            client.sendMessage(message.from, media, {
                caption: data.title
            });
        }
    } catch (error) {
        console.log(error);
        message.reply('Invalid meme type!\ntry to use single word ex: dark, wholesome, etc');
    }
}

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
const gif2mp4File = require('../utils/gif2mp4'); 

module.exports = async function bardCommand(client, message, prefix) {
    let utext = message.body.split(prefix + "bard")[1].trim();
    if (!utext.trim()) {
        await message.reply('No query!');
        return;
    }
    const writing = await message.reply('Writing...');
    try {        
        const response = await fetch(`https://tofu-api.onrender.com/chat/bard/${encodeURIComponent(utext)}`);
        const data = await response.json();
        if (data && data.content) {
            const respon = data.content;

            if (data.images && data.images.length > 0) {
                await writing.edit(data.content);
                let delay = 0;
                for (const imageUrl of data.images) {
                    setTimeout(async () => {
                    if (imageUrl.toLowerCase().endsWith('.gif')) {
                        const result = await gif2mp4File(imageUrl);
                        const media = await MessageMedia.fromUrl(result.result, { unsafeMime: true });
                        await message.reply(media, { sendVideoAsGif: true });
                    } else {
                        const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });
                        await message.reply(media);
                    }
                }, delay);
                delay += 1000;
                }
            } else {
                // No images, send the text response
                await writing.edit(respon);
            }
        } else {
            // Handle the case where the response does not have the expected structure
            await writing.edit('Unexpected response format from the API.');
        }
        
    } catch (error) {
        await message.reply('Something went wrong.'+`\n${error.message}`);
        console.error('Bard Error: '+`\n${error}`);
    }
};

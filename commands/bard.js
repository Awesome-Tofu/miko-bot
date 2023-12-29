const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
const gif2mp4File = require('../utils/gif2mp4'); // Assuming you have this utility function

module.exports = async function bardCommand(client, message) {
    let utext = message.body.replace('.bard ', '');
    console.log(utext.trim());
    if (utext.trim() === '.bard'|| utext.trim() === 'bard') {
        await message.reply('No query!');
        return;
    } 
    const writing = await message.reply('Writing...');
    try {        
        const response = await fetch(`https://tofuapi.onrender.com/chat/bard/${encodeURIComponent(utext)}`);
        const data = await response.json();

        if (data && data.content) {
            const respon = data.content;
            console.log(data);

            if (data.images && data.images.length > 0) {
                await writing.edit(data.content);

                for (const imageUrl of data.images) {
                    if (imageUrl.toLowerCase().endsWith('.gif')) {
                        const result = await gif2mp4File(imageUrl);
                        const media = await MessageMedia.fromUrl(result.result);
                        await client.sendMessage(message.from, media, { sendVideoAsGif: true });
                    } else {
                        const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });
                        await client.sendMessage(message.from, media);
                    }
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
        await writing.edit('Something went wrong.'+`\n${error.message}`);
    }
};

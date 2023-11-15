const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function instaCommand(client, message) {
    try {
        if (message.body.trim() === '.insta') {
            message.reply("No query!");
        } else {
            message.reply('```Please be patient while the media is downloading...```');
            const link = message.body.replace('.insta ', ''); // Fix variable name
            const response = await fetch(`https://vihangayt.me/download/instagram?url=${link}`);
            const data = await response.json();

            if (data.data.data.length > 0) {
                for (const mediaData of data.data.data) {
                    const type = mediaData.type;
                    const file = mediaData.url;

                    if (type === 'image') {
                        const media = await MessageMedia.fromUrl(file);
                        await client.sendMessage(message.from, media);
                    } else if (type === 'video') {
                        const media = await MessageMedia.fromUrl(file, { unsafeMime: true });
                        await client.sendMessage(message.from, media);
                    } else {
                        message.reply('Unknown media type');
                    }
                }
            } else {
                message.reply('No media found');
            }
        }
    } catch (error) {
        message.reply("Error! Account may be private or invalid link");
        console.error(error);
    }
};

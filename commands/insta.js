const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function instaCommand(client, message, prefix) {

    const utext = message.body.split(prefix + "insta")[1];
    const link = message.body.replace(prefix + "insta", "").trim();
    if (!utext.trim()) {
        await message.reply("No query!");
        return;
    } 

    const downloading_message = await message.reply('```Please be patient while the media is downloading...```');

    try {
            const response = await fetch(`https://vihangayt.me/download/instagram?url=${link}`);
            const data = await response.json();
            if (data.data.data.length > 0) {
                await downloading_message.edit('```Uploading```');
                for (const mediaData of data.data.data) {
                    const type = mediaData.type;
                    const file = mediaData.url;

                    if (type === 'image') {
                        const media = await MessageMedia.fromUrl(file);
                        await message.reply(media);
                    } else if (type === 'video') {
                        const media = await MessageMedia.fromUrl(file, { unsafeMime: true });
                        await message.reply(media);
                    } else {
                        downloading_message.edit('Unknown media type');
                    }
                }
                await downloading_message.delete(true);
            } else {
                downloading_message.edit('No media found');
            }
    } catch (error) {
        await downloading_message.edit("Error! Account may be private or invalid link");
        console.error(error);
    }
};

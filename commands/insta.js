const { igdl } = require('../utils/igdl');
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
        const data = await igdl(link);
        // console.log(data);
        for (const item of data.data) {
            const media = await MessageMedia.fromUrl(item, { unsafeMime: true });
            await downloading_message.edit("```Uploading...```")
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.reply(media);
        }
        
        await downloading_message.delete(true);
    } catch (error) {
        await downloading_message.edit("Error! Account may be private or invalid link");
        console.error(error);
    }
};

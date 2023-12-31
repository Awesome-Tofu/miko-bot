const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function emojiCommand(client, message, prefix) {
    try {
        const utext = message.body.split(prefix + "emoji")[1];
        if (!utext.trim()) {
            await message.reply(`no emoji added\n Example:\n${prefix}emoji 😅+☺️`);
            return;
        }else{
            const [emoji1, emoji2] = utext.split('+');
            const media = await MessageMedia.fromUrl(`https://translate-api-gray.vercel.app/emojimix?emoji1=${emoji1.trim()}&emoji2=${emoji2.trim()}`, {unsafeMime: true});
            media.mimetype = 'image/png';
            media.filename = "emoji.png";
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerName: utext, stickerAuthor: "Miku" });
        }

        
    } catch (error) {
        console.error(error);
        await message.reply("*Error*"+`\n${error.message}`);
    }
}

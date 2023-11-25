const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function emojiCommand(client, message) {
    try {
        const utext = message.body.replace('.emoji ', '')
        if (utext.trim() == '.emoji') {
            await message.reply('no emoji added\n Example:\n.emoji 😅+☺️')
        }else{
            const [emoji1, emoji2] = utext.split('+');
            const media = await MessageMedia.fromUrl(`https://api.erdwpe.com/api/maker/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`, {unsafeMime: true});
            media.mimetype = 'image/png';
            media.filename = "emoji.png"

            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        }

        
    } catch (error) {
        console.error(error);
        await message.reply("*Error*\n```Failed to process the emoji request```");
    }
}

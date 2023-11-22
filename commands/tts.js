const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function ttsCommand(client, message) {
    try {
        if (message.hasQuotedMsg) {
            let quotedMsg = await message.getQuotedMessage();
            let query = encodeURIComponent(quotedMsg.body); // Encode the text for the API request


            // Create a MessageMedia instance with the audio buffer
            const media = await MessageMedia.fromUrl(`https://api.yanzbotz.my.id/api/tts/aoi?query=${query}`, {unsafeMime: true});

            // Send the audio message to the user
            await client.sendMessage(message.from, media, { sendAudioAsVoice: true });
        } else {
            await message.reply("*Error*\n```Please reply to a text message to convert to speech```");
        }
    } catch (error) {
        console.error(error);
        await message.reply("*Error*\n```Failed to process the TTS request```");
    }
}


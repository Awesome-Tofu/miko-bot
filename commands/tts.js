const axios = require('axios');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const ffmpeg = require('fluent-ffmpeg');


async function downloadMP3(url, outputPath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(outputPath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading MP3:', error);
        throw error;
    }
}


module.exports = async function ttsCommand(client, message) {
    try {
        if (message.hasQuotedMsg) {
            let quotedMsg = await message.getQuotedMessage();
            let query = encodeURIComponent(quotedMsg.body); // Encode the text for the API request


            // Create a MessageMedia instance with the audio buffer
            // const media = await MessageMedia.fromUrl(`https://api.yanzbotz.my.id/api/tts/aoi?query=${query}`, {unsafeMime: true});
            const mp3Url = `https://api.yanzbotz.my.id/api/tts/aoi?query=${query}`;

            const outputPath = './commands/audio_dl/download.mp3';

            await downloadMP3(mp3Url, outputPath);
            // Send the audio message to the user
            // await client.sendMessage(message.from, media, { sendAudioAsVoice: true });
            await processAudio(client, message, './commands/audio_dl/download.mp3');
        } else {
            await message.reply("*Error*\n```Please reply to a text message to convert to speech```");
        }
    } catch (error) {
        // console.error(error);
        await message.reply("*Error*\n```Failed to process the TTS request```");
    }
}
async function processAudio(client, message, inputFilePath) {
    try {
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(inputFilePath)
                .audioChannels(1)
                .audioCodec('opus')
                .toFormat('ogg')
                .addOutputOptions('-avoid_negative_ts make_zero')
                .on('end', resolve)
                .on('error', reject)
                .save(`./commands/audio_dl/processed.ogg`);
        });

        // Create MessageMedia from the processed audio
        const media = await MessageMedia.fromFilePath(`./commands/audio_dl/processed.ogg`);
        media.filename = `youtubedl.ogg`;

        // Send the processed audio as a voice message
        await client.sendMessage(message.from, media, { ptt: true });
    } catch (error) {
        console.error('Error processing audio:', error);
    }
}
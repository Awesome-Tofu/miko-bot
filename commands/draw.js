const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

let processingRequest = false;

module.exports = async function drawCommand(client, message, prefix) {
    if (processingRequest) {
        return await message.reply('Another request is currently being processed. Please wait.');
    }

    processingRequest = true;

    try {
        const utext = message.body.split(prefix + "draw")[1];
        const processing = await message.reply(`*Processing...*`);
        const models = ['quartz', 'MeinaHentai', 'Counterfeit-V3.0', 'MeinaUnreal', 'NUKE - ColorMax Anime', 'Loli Diffusion AOM2 SFW'];
        const randomModel = models[Math.floor(Math.random() * models.length)];
        const payload = {
            model: randomModel,
            prompt: utext,
            neg_prompt: 'Bad hand, bad face, bad art, bad legs, bad chest, bad body, bad quality',
        }
        const api = 'https://seaart-api-0efcd1a45b0a.herokuapp.com/generate';
        const response = await axios.post(api, payload);
        const data = response.data;
        const processedImg = data.img;
        const chosmodel = data.model;
        await processing.edit('Done!');
        const media = await MessageMedia.fromUrl(processedImg, {unsafeMime: true});
        await client.sendMessage(message.from, media, {caption: `*Prompt:* ${utext}\n*Model:* ${chosmodel}`})
    } catch (error) {
        console.error(error);
        await message.reply('An error occurred while processing your request. Please try again later.');
    } finally {
        processingRequest = false;
    }
}

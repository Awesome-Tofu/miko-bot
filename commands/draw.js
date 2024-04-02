const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
let processingRequest = false;
const t = require('../utils/drawmodule');

async function getimg(req_id) {
    const response = await axios.get(`https://apis-awesome-tofu.koyeb.app/api/seaart/getimg?token=${t.o}&req_id=${req_id}`);
    const data = response.data;
    if (data.status !== "FINISHED") {
        return getimg(req_id);
    } else {
        return data.url;
    }
}

async function getmodel(modelid) {
    const data = { "id": modelid }
    const response = await axios.post('https://www.seaart.ai/api/v1/model/detail', data, {
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        }
    });
    return response.data.data.name;
}

module.exports = async function drawCommand(client, message, prefix) {
    if (processingRequest) {
        return await message.reply('Another request is currently being processed. Please wait.');
    }

    processingRequest = true;

    try {
        const utext = message.body.split(prefix + "draw")[1];
        if (!utext.trim()) {
            await message.reply(`No query!\nExample: ${prefix}draw 1girl, Dark red hair, black dress, silver hair in manga style`)
            return;
        }
        const processing = await message.reply(`*Processing...*`);
        const models = ['68cce2cd1bef6cbb6393876d4790da43', '014004d18d0dcc73a128467096107c69', '038254337d59ef522fdb64268bc28e47', '0c97b277da98f5ff4d92774e0fe69889'];
        const randomModel = models[Math.floor(Math.random() * models.length)];
        const neg_prompt = 'Bad hand, bad face, bad art, bad legs, bad chest, bad body, bad quality'
        const payload = {
            "token": t.o,
            "model_id": randomModel,
            "prompt": utext,
            "neg_prompt": neg_prompt
        }
        const preResponse = await axios.post('https://apis-awesome-tofu.koyeb.app/api/seaart', payload);
        const req_id = preResponse.data.req_id;
        const processedImg = await getimg(req_id);;
        const chosmodel = await getmodel(randomModel);
        await processing.edit('Done!');
        const media = await MessageMedia.fromUrl(processedImg, { unsafeMime: true });
        await client.sendMessage(message.from, media, { caption: `*Prompt:* ${utext}\n*Model:* ${chosmodel}` })
    } catch (error) {
        console.error(error);
        await message.reply('An error occurred while processing your request. Please try again later.');
    } finally {
        processingRequest = false;
    }
}

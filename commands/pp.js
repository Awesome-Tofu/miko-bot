const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function ppCommand(client, message) {
    try{
        const response = await fetch('https://api.erdwpe.com/api/randomgambar/couplepp');
        const data = await response.json();
        const male = data.result.male;
        const female = data.result.female;
        const media = await MessageMedia.fromUrl(male);
        await client.sendMessage(message.from, media, {caption:"Male"});
        const media2 = await MessageMedia.fromUrl(female);
        await client.sendMessage(message.from, media2, {caption:"Female"});
    }catch(error){
        message.reply('Something went wrong!', `\n${error.message}`)
    }
   
}
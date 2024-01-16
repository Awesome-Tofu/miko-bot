const { MessageMedia } = require('whatsapp-web.js');
const gif2mp4File = require('../utils/gif2mp4');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async function startCommand(client, message) {
    const randomStickers = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
    const sticker = MessageMedia.fromFilePath(`${__dirname}/stickers/${randomStickers}.png`);
    client.sendMessage(message.from, sticker, { sendMediaAsSticker: true });
    let arraygif = ['wave','poke','blush','cuddle','happy','hug', 'pat', 'kiss'];
    const randomEndpoints = arraygif[Math.floor(Math.random() * arraygif.length)];
    //Will be used when gif cant be converted into mp4 by gif2mp4File
    const startMP4 = ['https://te.legra.ph/file/75425ff5092bcab899d7d.mp4', 'https://te.legra.ph/file/304e0c1af676c04ae6d96.mp4'];
    const randMP4 = startMP4[Math.floor(Math.random() * startMP4.length)];
    const startMessage = 'Hello there! Welcome to the bot.\n\nI am Miko, how can I serve you master? You can add me in any group you want. I will be happy to manage your group.\nType .help to get all my commands'

  //Handling gif2video converter error
    try {
        let response = await fetch('https://nekos.best/api/v2/'+randomEndpoints)
        const data = await response.json();
        const gifFile = data.results[0].url;   
        try{
        const result = await gif2mp4File(gifFile);
        const media = await MessageMedia.fromUrl(result.result);
        client.sendMessage(message.from, media, {
            caption: startMessage,
            sendVideoAsGif: true
        });
    } catch (error){
        console.log("Caught Error while converting gif to mp4\n"+error)
        const media = await MessageMedia.fromUrl(randMP4);
        client.sendMessage(message.from, media, {
            caption: startMessage,
            sendVideoAsGif: true
        });
      }
    } catch (error) {
        console.error('Error while running nekos best API endpoint\n'+error);
        let response = await fetch('https://tofu-api.onrender.com/get_gif/'+randomEndpoints)
        const data = await response.json();
        const gifFile = data.gif_url;
        try{
        const result = await gif2mp4File(gifFile);
        const media = await MessageMedia.fromUrl(result.result);
        client.sendMessage(message.from, media, {
            caption: startMessage,
            sendVideoAsGif: true
        });
        }catch (error){
        console.log("Caught Error while converting gif to mp4\n"+error)
        const media = await MessageMedia.fromUrl(randMP4);
        client.sendMessage(message.from, media, {
            caption: startMessage,
            sendVideoAsGif: true
        });
      }
    }
};

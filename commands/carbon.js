const { MessageMedia } = require('whatsapp-web.js');

  module.exports = async function carbonCommand(client, message, prefix){
    try{
        const utext = message.body.split(prefix + "carbon")[1];
        if(!utext.trim()){
            await message.reply("No Query!");
            return;
        }else{
            const carbonAPI = 'https://api.yanzbotz.my.id/api/maker/carbon?text='
            const media = await MessageMedia.fromUrl(`${carbonAPI}${encodeURIComponent(utext)}`, {unsafeMime: true});
            media.mimetype = 'image/png';
            media.filename = "carbon.png";
            await client.sendMessage(message.from, media);
        }
    }catch(err){
        message.reply("error!");
    }
  }

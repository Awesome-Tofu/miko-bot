const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
require('dotenv').config();


module.exports = async function extractCommand(client, message) {
 try{
 const utext = message.body.replace('.extract', '').trim();
 if(!utext){
    await message.reply("Please tag someone to get thier phone number info");
}else{
    if(utext.includes('@')){
        const user_num = utext.replace('@','')
        const user_pp = await client.getProfilePicUrl(`${user_num}@c.us`) || "https://te.legra.ph/file/7ea1d50fdd0b2e7c447cc.png";
        const NUMKEY = process.env.NUMVERIFY_KEY || "13e4e196a58f64646251999692b9d006";
        const response = await fetch(`http://apilayer.net/api/validate?access_key=${NUMKEY}&number=${user_num}`);
        const data = await response.json();
        const country_name= data.country_name;
        const location = data.location;
        const line_type = data.line_type;
        const country_code = data.country_code;
        const country_prefix = data.country_prefix;
        const local_format = data.local_format;
        const carrier = data.carrier;

        const captionMessage = `╒═══「 • ᴜsᴇʀ ɪɴғᴏʀᴍᴀᴛɪᴏɴ • 」
✦ ᴜsᴇʀ Number: ${country_prefix} ${local_format}
✦ ᴜsᴇʀ Country: ${country_name}, (${country_code})
✦ ᴜsᴇʀ Location: ${location}
✦ ᴜsᴇʀ line type: ${line_type}
✦ carrier: ${carrier || "undefined"}`;
        const userPhotoMedia = await MessageMedia.fromUrl(user_pp);
        await client.sendMessage(message.from, userPhotoMedia, {caption: captionMessage});
    }else{
        message.reply("please write in this format @userNumber here without space ");
    }
}
 }catch(error){
    console.error(error);
    message.reply("error")
}   
  

}

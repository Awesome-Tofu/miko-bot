const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function testCommand(client, message) {
    const quotedMsg = await message.getQuotedMessage();
    if(quotedMsg.isGif == true){
        const attachmentData = await quotedMsg.downloadMedia();
        fs.writeFileSync('./commands/webps/input.mp4', attachmentData.data, 'base64');
        const sticker = await MessageMedia.fromFilePath(`${__dirname}/webps/input.mp4`);
        await client.sendMessage(message.from, sticker, { sendMediaAsSticker: true });  
    }
}
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

async function stickerCommand(client, message, prefix) {
  let quotedMsg = await message.getQuotedMessage();
  let utext = message.body.split(prefix + "sticker")[1];
  let stickerName;
  let stickerAuthor;
  if (utext){
      stickerName = utext;
      const contact = await message.getContact();
      stickerAuthor = contact.pushname;
  }else{
      stickerName = "🙂";
      stickerAuthor = "Miku";
  }
    if (!quotedMsg){
      message.reply(`🙇‍♂️ *Error*\n\n` + "```Please reply to an image or gif or short video```");
      return;
    }
    

    if (quotedMsg.isGif == true){
        const attachmentData = await quotedMsg.downloadMedia();
        fs.writeFileSync('./commands/webps/input.mp4', attachmentData.data, 'base64');
        const sticker = await MessageMedia.fromFilePath(`${__dirname}/webps/input.mp4`);
        await client.sendMessage(message.from, sticker, { sendMediaAsSticker: true, stickerName: stickerName, stickerAuthor: stickerAuthor });  
        return;
    }
    try{
        if (quotedMsg.hasMedia == true) {
            if (quotedMsg.isGif == false){
            let attachmentData = await quotedMsg.downloadMedia();
            await client.sendMessage(
            message.from,
            new MessageMedia(
            attachmentData.mimetype,
            attachmentData.data,
            attachmentData.filename
            ),
            { sendMediaAsSticker: true, stickerName: stickerName, stickerAuthor: stickerAuthor}
      );
    }
    } else {
      await client.sendMessage(
        message.from,
        `🙇‍♂️ *Error*\n\n` + "```No image found to make a Sticker```"
      );
    }
}catch (error){
    message.reply(`🙇‍♂️ *Error*\n\n` + `\n\n${error.message}`);
}
    
}


module.exports = stickerCommand
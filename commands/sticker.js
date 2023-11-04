const { MessageMedia } = require('whatsapp-web.js');


module.exports = async function stickerCommand(client, message) {
    message.delete(true);
    let quotedMsg = await message.getQuotedMessage();
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
            { sendMediaAsSticker: true }
      );
    }
    } else {
      await client.sendMessage(
        message.from,
        `🙇‍♂️ *Error*\n\n` + "```No image found to make a Sticker```"
      );
    }
}catch (error){
    message.reply(`🙇‍♂️ *Error*\n\n` + "```Please reply to media```")
}
    
}
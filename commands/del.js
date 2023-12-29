module.exports = async function delCommand(client, message) {
    try {
        if (message.hasQuotedMsg) {
            let quotedMsg = await message.getQuotedMessage();
            await quotedMsg.delete(true);
            
            message.delete(true);
        }else{
            message.reply('Please reply to the message message!')
        }
    } catch (error) {
        message.reply('I am not admin');
    }
}
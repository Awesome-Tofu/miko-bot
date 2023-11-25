module.exports = async function delCommand(client, message) {
    try {
        if (message.hasQuotedMsg) {
            let quotedMsg = await message.getQuotedMessage();
            await quotedMsg.delete(true);
        }
    } catch (error) {
        message.reply('I am not admin');
    }
}
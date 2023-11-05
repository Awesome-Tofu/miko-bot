module.exports = async function echoCommand(client, message) {
    message.reply(message.body);
}
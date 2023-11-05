module.exports = async function helpCommand(client, message) {
    message.reply(`Available Command list:
    start - will start the bot
    help - help message
    ping - Pong
    tl or telegraph - generate link of file
    tr - translate
    gpt - Ask GPT
    bard - Ask bard
    `);
}

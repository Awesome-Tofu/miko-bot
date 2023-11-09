module.exports = async function helpCommand(client, message) {
    await message.reply(`Available Command list:
    start - will start the bot
    help - help message
    ping - Pong
    tl or telegraph - generate link of file
    tr - translate
    gpt - Ask GPT
    bard - Ask bard
    imagine - generates image, be patient while running this command
    sticker - converts to sticker from photo
    repo - provides repo (deployable on render)
    info - get info of replied user
    audio [yt link] - To download high quality audio.
    video [yt link] - To download high quality video.
    detail [yt link] - To get both video and channel information
    q - quotely the message
    paste - paste the text to link
    extract - get number info
    more coming soon.. 
    `);
}

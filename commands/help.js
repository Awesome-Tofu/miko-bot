module.exports = async function helpCommand(client, message) {
    await message.reply(`➦Available Command list:
➥*start* - will start the bot
➥*help* - help message
➥*ping* - Pong
➥*tl* or *telegraph* - generate link of file
➥*tr* - translate
➥*gpt* [prompt] - Ask GPT
➥*bard* [prompt] - Ask bard
➥*imagine* [prompt] - generates image, be patient while running this command
➥*sticker* - converts to sticker from photo
➥*repo* - provides repo (deployable on render)
➥*info* - get info of replied user
➥*audio* [yt link] - To download high quality audio.
➥*video* [yt link] - To download high quality video.
➥*insta [insta link]* - Get instagram video/photo.
➥*detail* [yt link] - To get both video and channel information
➥*q* - quotely the message
➥*paste* [text] - paste the text to link
➥*extract* [@number]- get number info
➥*hanime* - get hanime videos
more coming soon... 
    `);
}

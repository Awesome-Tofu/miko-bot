module.exports = async function helpCommand(client, message) {
    await message.reply(`➦ *Available Command list:*
➥ *start* - will start the bot
➥ *help* - help message
➥ *ping* - Pong
➥ *tl* or *telegraph* - generate link of file
➥ *tr* - translate
➥ *gpt* [prompt] - Ask GPT
➥ *gpt5* [prompt] - Ask GPT 5
➥ *bard* [prompt] - Ask bard
➥ *imagine* [prompt] - generates image, be patient while running this command
➥ *sticker* - converts to sticker from photo
➥ *repo* - provides repo (deployable on render)
➥ *info* - get info of replied user
➥ *audio* [yt link] - To download high quality audio.
➥ *video* [yt link] - To download high quality video.
➥ *insta* [insta link] - Get instagram video/photo.
➥ *detail* [yt link] - To get both video and channel information
➥ *q* - quotely the message
➥ *paste* [text] - paste the text to link
➥ *extract* [@number]- get number info
➥ *hanime* - get hanime videos
➥ *code* - generate code (code assistant)
➥ *wanted* - get one piece bounty of given image
➥ *enhance* or *upscale* - enhance the given picture
➥ *tts* - convert text to speech model aoi
➥ *pp* - get random couple pfp
➥ *sauce* - get source of replied anime media
➥ *tiny* [link] - get shortened url of given link
➥ *rmbg* - remove background of replied photo
➥ *carbon* [text] - get carbon photo of given text


more coming soon...
    `);
}

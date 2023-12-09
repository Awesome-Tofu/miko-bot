module.exports = async function helpCommand(client, message) {
    await message.reply(`➦ *Available Command list:*
➥ *start* - will start the bot
➥ *restart* - redeploy the bot (only owner)
➥ *term* [comamnd] - run the terminal (only owner)
➥ *help* - help message
➥ *ping* - Pong
➥ *promote* - promote replied user
➥ *demote* - demote replied user
➥ *kick* - remove replied user
➥ *report* [message] - feel free to report any problem to devs
➥ *support* - join our support group
➥ *tl* or *telegraph* - generate link of file
➥ *tr* - translate
➥ *gpt* [prompt] - Ask GPT
➥ *gpt5* [prompt] - Ask GPT 5
➥ *bard* [prompt] - Ask bard
➥ *imagine* [prompt] - generates image, be patient while running this command
➥ *sticker* - converts image to sticker
➥ *asticker* - converts gif to sticker
➥ *repo* - provides repo (deployable on render)
➥ *info* - get info of replied user
➥ *audio* [yt link] - To download high quality audio.
➥ *video* [yt link] - To download high quality video.
➥ *insta* [insta link] - Get instagram video/photo.
➥ *detail* [yt link] - To get both video and channel information
➥ *q* - quotely the message
➥ *paste* [text] - paste the text to link
➥ *extract* [@number]- get number info
➥ *hanime* - get hanime videos (m3u8)
➥ *hbar* - get hentaibar videos (mp4)
➥ *code* - generate code (code assistant)
➥ *wanted* [name bounty] - get one piece bounty of given image
➥ *enhance* or *upscale* - enhance the given picture
➥ *tts* - convert text to speech model aoi
➥ *pp* - get random couple pfp
➥ *sauce* - get source of replied anime media
➥ *tiny* [link] - get shortened url of given link
➥ *rmbg* - remove background of replied photo
➥ *carbon* [text] - get carbon photo of given text
➥ *toanime* - convert image to anime
➥ *toanime3d* - convert image to 3d anime
➥ *emoji* [☺️+😅] - mix your emojis
➥ *pin* [query] - get pinterest images


more coming soon...
    `);
}

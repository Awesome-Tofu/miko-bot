module.exports = async function helpCommand(client, message) {
    await message.reply(`
*💻 Owner or Sudo Commands:*
➥ *eval* [code] - Evaluate the given JavaScript code
➥ *term* [command] - Execute the given command in terminal
➥ *sudos* - List all sudo users
➥ *addsudo* - Add a sudo user
➥ *delsudo* - Remove a sudo user

*🤖 Bot Commands:*
➥ *start* - Start the bot
➥ *help* - Display this help message
➥ *ping* - Pong!

*👥 User Management:*
➥ *promote* [@tag] - Promote replied user (only admins)
➥ *demote* [@tag] - Demote replied user (only admins)
➥ *kick* [@tag] - Remove replied user (only admins)
➥ *chatbot* [on/off] - turn on or off chatbot (only admins)
➥ *id* [@tag] - Get user ID
➥ *info* - Get info of replied user
➥ *extract* [@number] - Get number info

*🔧 Utilities:*
➥ *report* [message] - Report any problem to devs
➥ *support* - Join our support group
➥ *tl* or *telegraph* - Generate link of file
➥ *tr* [language code] - Translate
➥ *paste* [text] - Paste the text to link
➥ *tiny* [link] - Get shortened URL of given link
➥ *wiki* [query] - Get details from Wikipedia
➥ *sauce* - Get source of replied anime media
➥ *getprompt* - Get ai prompt from replied image

*📚 Learning Commands:*
➥ *code* [prompt] - Generate code (code assistant PaLM)
➥ *gpt* [prompt] - Ask GPT
➥ *bard* [prompt] - Ask bard

*🎨 Media Commands:*
➥ *sticker* [sticker name] - Convert image/gif/video to sticker
➥ *audio* [yt link] - Download high quality YouTube audio
➥ *video* [yt link] - Download high quality YouTube video
➥ *insta* [insta link] - Get Instagram video/photo
➥ *detail* [yt link] - Get video info and channel info
➥ *rmbg* - Remove background of replied photo
➥ *enhance* or *upscale* - Enhance the given picture
➥ *pint* [query] - Get Pinterest images

*🎭 Fun Commands:*
➥ *q* - Quotely the message
➥ *imagine* ["prompt" "negative prompt"] (some models won't work sometimes) - Generates image, be patient while running this command
➥ *draw* [prompt] - in case imagine command is not working
➥ *meme* [category] - Get random meme
➥ *joke* [category] - Get random joke
➥ *wanted* ["name" bounty] - Get One Piece bounty of given image
➥ *tts* ⚠️Depecrated - Convert text to speech model aoi
➥ *emoji* [☺️+😅] - Mix your emojis
➥ *pp* - Get random couple pfp
➥ *carbon* [text] - Get carbon photo of given text
➥ *toanime* - Convert image to anime
➥ *toanime3d* - Convert image to 3D anime


*🔞 NSFW Commands:*
➥ *hanime* - Get hanime videos (m3u8)
➥ *hbar* - Get hentaibar videos (mp4)

*🔗 Other Commands:*
➥ *repo* - Provides repo (deployable on Heroku)
➥ *owner* - Provides owner contact

    `);
}

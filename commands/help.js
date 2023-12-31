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
➥ *restart* - Redeploy the bot (only owner)
➥ *help* - Display this help message
➥ *ping* - Pong!

*👥 User Management:*
➥ *promote* [@tag] - Promote replied user
➥ *demote* [@tag] - Demote replied user
➥ *kick* [@tag] - Remove replied user
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

*🎨 Media Commands:*
➥ *sticker* [sticker name] - Convert image/gif/video to sticker
➥ *audio* [yt link] - Download high quality YouTube audio
➥ *video* [yt link] - Download high quality YouTube video
➥ *insta* [insta link] - Get Instagram video/photo
➥ *detail* [yt link] - Get video info and channel info
➥ *q* - Quotely the message
➥ *rmbg* - Remove background of replied photo
➥ *enhance* or *upscale* - Enhance the given picture
➥ *toanime* - Convert image to anime
➥ *toanime3d* - Convert image to 3D anime
➥ *emoji* [☺️+😅] - Mix your emojis
➥ *pint* [query] - Get Pinterest images

*🎭 Fun Commands:*
➥ *imagine* [prompt] (won't work for now) - Generates image, be patient while running this command
➥ *wanted* ["name" bounty] - Get One Piece bounty of given image
➥ *tts* - Convert text to speech model aoi
➥ *pp* - Get random couple pfp
➥ *carbon* [text] - Get carbon photo of given text
➥ *sauce* - Get source of replied anime media

*📚 Learning Commands:*
➥ *code* - Generate code (code assistant PaLM)
➥ *gpt* [prompt] - Ask GPT
➥ *bard* [prompt] - Ask bard

*🔞 NSFW Commands:*
➥ *hanime* - Get hanime videos (m3u8)
➥ *hbar* - Get hentaibar videos (mp4)

*🔗 Other Commands:*
➥ *repo* - Provides repo (deployable on Heroku)

More coming soon...
    `);
}
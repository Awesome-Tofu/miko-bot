module.exports = async function helpCommand(client, message, prefix) {
    await message.reply(`
*💻 Owner or Sudo Commands:*
➥ *${prefix}eval* [code] - Evaluate the given JavaScript code
➥ *${prefix}term* [command] - Execute the given command in terminal
➥ *${prefix}sudos* - List all sudo users
➥ *${prefix}addsudo* - Add a sudo user
➥ *${prefix}delsudo* - Remove a sudo user

*🤖 Bot Commands:*
➥ *${prefix}start* - Start the bot
➥ *${prefix}help* - Display this help message
➥ *${prefix}ping* - Pong!

*👥 User Management:*
➥ *${prefix}promote* [@tag] - Promote replied user (only admins)
➥ *${prefix}demote* [@tag] - Demote replied user (only admins)
➥ *${prefix}kick* [@tag] - Remove replied user (only admins)
➥ *${prefix}revoke* - Reset group chat link (only admins) 
➥ *${prefix}invite* - Get group chat link
➥ *${prefix}tagall* - Tag everyone in the group (only admins)
➥ *${prefix}chatbot* [on/off] - turn on or off chatbot (only admins)
➥ *${prefix}id* [@tag] - Get user ID
➥ *${prefix}info* - Get info of replied user
➥ *${prefix}extract* [@number] - Get number info

*🔧 Utilities:*
➥ *${prefix}report* [message] - Report any problem to devs
➥ *${prefix}support* - Join our support group
➥ *${prefix}tl* or *telegraph* - Generate link of file
➥ *${prefix}tr* [language code] - Translate
➥ *${prefix}paste* [text] - Paste the text to link
➥ *${prefix}tiny* [link] - Get shortened URL of given link
➥ *${prefix}wiki* [query] - Get details from Wikipedia
➥ *${prefix}sauce* - Get source of replied anime media
➥ *${prefix}getprompt* - Get ai prompt from replied image
➥ *${prefix}truecaller* - Get details from truecaller

*📚 Learning Commands:*
➥ *${prefix}code* [prompt] - Generate code (code assistant Blackbox)
➥ *${prefix}bard* [prompt] - Ask bard
➥ *${prefix}palm* [prompt] - Ask PaLM
➥ *${prefix}gpt* [prompt] - Ask GPT

*⬇️ Downloader Commands:*
➥ *${prefix}song* [yt link or query] - Download high quality YouTube audio
➥ *${prefix}video* [yt link or query] - Download high quality YouTube video
➥ *${prefix}insta* [insta link] - Get Instagram video/photo
➥ *${prefix}detail* [yt link] - Get video info and channel info

*🎨 Media Commands:*
➥ *${prefix}sticker* [sticker name] - Convert image/gif/video to sticker
➥ *${prefix}rmbg* - Remove background of replied photo
➥ *${prefix}enhance* or *upscale* - Enhance the given picture
➥ *${prefix}pint* [query] - Get Pinterest images

*🎭 Fun Commands:*
➥ *${prefix}q* - Quotely the message
➥ *${prefix}imagine* ["prompt" "negative prompt"] (better use draw command) - Generates image, be patient while running this command
➥ *${prefix}draw* [prompt] - in case imagine command is not working
➥ *${prefix}meme* [category] - Get random meme
➥ *${prefix}joke* [category] - Get random joke
➥ *${prefix}wanted* ["name" bounty] - Get One Piece bounty of given image
➥ *${prefix}tts* - Convert text to speech model aoi
➥ *${prefix}emoji* [☺️+😅] - Mix your emojis
➥ *${prefix}pp* - Get random couple pfp
➥ *${prefix}carbon* [text] - Get carbon photo of given text
➥ *${prefix}toanime* - Convert image to anime
➥ *${prefix}toanime3d* - Convert image to 3D anime


*🔞 NSFW Commands:*
➥ *${prefix}hbar* - Get hentaibar videos (mp4)

*🔗 Other Commands:*
➥ *${prefix}repo* - Provides repo (deployable on Heroku)
➥ *${prefix}owner* - Provides owner contact

    `);
}

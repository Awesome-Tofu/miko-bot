const { MessageMedia } = require('whatsapp-web.js');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function infoCommand(client, message, prefix) {
    const quotedMsg = await message.getQuotedMessage();
    if (quotedMsg) {
        // Get the chat associated with the quoted message
        const chat = await quotedMsg.getChat();

        // Check if it's a group chat
        if (chat.isGroup) {
            const authorId = quotedMsg.author;
            const isAdmin = chat.participants.find((participant) => {
                return participant.id._serialized === authorId && participant.isAdmin;
            });

            let presence;
            if (isAdmin) {
                presence = 'Admin';
            }else {
                presence = 'Member';
            }
            const user_pp = await client.getProfilePicUrl(quotedMsg.author || quotedMsg.from) || "https://te.legra.ph/file/7ea1d50fdd0b2e7c447cc.png";
            const contact = await quotedMsg.getContact();
            const user_name = contact.pushname;
            const user_num = quotedMsg.author.replace('@c.us', '') || quotedMsg.from.replace('@c.us', '');
            const NUMKEY = process.env.NUMVERIFY_KEY || "13e4e196a58f64646251999692b9d006";
            const response = await fetch(`http://apilayer.net/api/validate?access_key=${NUMKEY}&number=${user_num}`);
            const data = await response.json();
            const country_name= data.country_name;
            const location = data.location;
            const line_type = data.line_type;
            const country_code = data.country_code;
            const country_prefix = data.country_prefix;
            const local_format = data.local_format;
            const carrier = data.carrier;


            const captionMessage = `╒═══「 • ᴜsᴇʀ ɪɴғᴏʀᴍᴀᴛɪᴏɴ • 」\n✦ ᴜsᴇʀ ɴᴀᴍᴇ: ${user_name}\n✦ ᴜsᴇʀ Number: ${country_prefix} ${local_format}\n✦ ᴜsᴇʀ Country: ${country_name}, (${country_code})\n✦ ᴜsᴇʀ Location: ${location}\n✦ ᴜsᴇʀ line type: ${line_type}\n✦ carrier: ${carrier || "undefined"}\n✦ ᴘʀᴇsᴇɴᴄᴇ: ${presence}`;

            const userPhotoMedia = await MessageMedia.fromUrl(user_pp);
            await client.sendMessage(message.from, userPhotoMedia, {caption: captionMessage});
        } else {
            // Not a group chat
            message.reply('This command is only applicable in group chats.');
        }
    } else {
        message.reply('Please reply to the user to get their info.');
    }
};

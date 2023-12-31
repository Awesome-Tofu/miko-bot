async function promoteCommand(client, message) {
    // Check if the message is from a group
    const chat = await message.getChat();
    if (!chat.isGroup) {
        message.reply('This command only works in groups.');
        return;
    }

    // Check if bot is an admin
    const botId = `${process.env.BOT_NUMBER}@c.us`;
    const isBotAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === botId && participant.isAdmin;
    });
    if (!isBotAdmin) {
        message.reply('I am not admin, promote me to admin to use this command');
        return;
    }

    // Check if the sender is an admin

    const senderId = message.author;
    const isAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === senderId && participant.isAdmin;
    });
    if (!isAdmin) {
        message.reply('You are not an admin.');
        return;
    }

    // Check if the message is a reply and get the replied user
    const utext = await message.getMentions();
    const quotedMessage = await message.getQuotedMessage();
    if (!quotedMessage && utext.length === 0) {
        message.reply('Please reply to a user or tag whom you want to promote.');
        return;
    }


    // Check if the replied user is already an admin
    let repliedUserId;
    try {
        repliedUserId = quotedMessage.author;
    } catch (error) {
        repliedUserId = utext[0].id._serialized;
    }
    const isrepliedUserAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === repliedUserId && participant.isAdmin;
    });
    if (isrepliedUserAdmin) {
        message.reply('User is already an admin.');
        return;
    }

    // Promote the replied user
    try {
        await chat.promoteParticipants([repliedUserId]);
        let contact;
        try {
            contact = await quotedMessage.getContact();
        } catch (error) {
            contact = await client.getContactById(utext[0].id._serialized);
        }
        client.sendMessage(message.from, `User @${contact.id.user} has been promoted to admin.`, {
            mentions: [contact]
        });
    } catch (error) {
        console.error('Error promoting user:', error);
        message.reply('An error occurred while promoting the user.');
    }
};


async function demoteCommand(client, message){
    // Check if the message is from a group
    const chat = await message.getChat();
    if (!chat.isGroup) {
        message.reply('This command only works in groups.');
        return;
    }

    // Check if bot is an admin
    const botId = `${process.env.BOT_NUMBER}@c.us`;
    const isBotAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === botId && participant.isAdmin;
    });
    if (!isBotAdmin) {
        message.reply('I am not admin, promote me to admin to use this command');
        return;
    }

    // Check if the sender is an admin
    const senderId = message.author;
    const isAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === senderId && participant.isAdmin;
    });
    if (!isAdmin) {
        message.reply('You are not an admin. This command is only available for admins');
        return;
    }

    // Check if the message is a reply and get the replied user
    const utext = await message.getMentions();
    const quotedMessage = await message.getQuotedMessage();
    if (!quotedMessage && utext.length === 0) {
        message.reply('Please reply to a user or tag whom you want to demote.');
        return;
    }


    // Check if the replied user is already an admin
    let repliedUserId;
    try {
        repliedUserId = quotedMessage.author;
    } catch (error) {
        repliedUserId = utext[0].id._serialized;
    }
    const isrepliedUserAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === repliedUserId && participant.isAdmin;
    });
    if (!isrepliedUserAdmin) {
        message.reply('User is already not an admin.');
        return;
    }

    // Demote the replied user
    try {
        await chat.demoteParticipants([repliedUserId]);
        let contact;
        try {
            contact = await quotedMessage.getContact();
        } catch (error) {
            contact = await client.getContactById(utext[0].id._serialized);
        }
        client.sendMessage(message.from, `User @${contact.id.user} has been demoted to member.`, {
            mentions: [contact]
        });
    } catch (error) {
        console.error('Error demoting user:', error);
        message.reply('An error occurred while demoting the user.');
    }
}

async function kickCommand(client, message){
    // Check if the message is from a group
    const chat = await message.getChat();
    if (!chat.isGroup) {
        message.reply('This command only works in groups.');
        return;
    }

    // Check if bot is an admin
    const botId = `${process.env.BOT_NUMBER}@c.us`;
    const isBotAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === botId && participant.isAdmin;
    });
    if (!isBotAdmin) {
        message.reply('I am not admin, promote me to admin to use this command');
        return;
    }

    // Check if the sender is an admin
    const senderId = message.author;
    const isAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === senderId && participant.isAdmin;
    });
    if (!isAdmin) {
        message.reply('You are not an admin. This command is only available for admins');
        return;
    }

    // Check if the message is a reply and get the replied user
    const utext = await message.getMentions();
    const quotedMessage = await message.getQuotedMessage();
    if (!quotedMessage && utext.length === 0) {
        message.reply('Please reply to a user or tag whom you want to kick.');
        return;
    }


    // Check if the replied user is already an admin
    let repliedUserId;
    try {
        repliedUserId = quotedMessage.author;
    } catch (error) {
        repliedUserId = utext[0].id._serialized;
    }
    const isrepliedUserAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === repliedUserId && participant.isAdmin;
    });
    if (isrepliedUserAdmin) {
        message.reply('User is an admin.');
        return;
    }

    // Demote the replied user
    try {
        await chat.removeParticipants([repliedUserId]);
        let contact;
        try {
            contact = await quotedMessage.getContact();
        } catch (error) {
            contact = await client.getContactById(utext[0].id._serialized);
        }
        client.sendMessage(message.from, `User @${contact.id.user} has been kicked from the group.`, {
            mentions: [contact]
        });
    } catch (error) {
        console.error('Error kicking user:', error);
        message.reply('An error occurred while kicking the user.');
    }
}

async function inviteCommand(client, message) {
    // Check if the message is from a group
    const chat = await message.getChat();
    if (!chat.isGroup) {
        message.reply('This command only works in groups.');
        return;
    }

    const botId = `${process.env.BOT_NUMBER}@c.us`;
    const isBotAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === botId && participant.isAdmin;
    });
    if (!isBotAdmin) {
        message.reply('I am not admin, promote me to admin to use this command');
        return;
    }

    // Get the group's invitation link
    try {
        const inviteCode = await chat.getInviteCode();
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
        message.reply("```Group Invitation link🔗```\n\n"+inviteLink);
    } catch (error) {
        console.error('Error getting group invitation link:', error);
        message.reply('An error occurred while getting the group invitation link.');
    }
};


async function reportCommand(client, message, prefix) {
    const utext = message.body.split(prefix + "report")[1];
    let inviteLink;
    if(!utext.trim()){
        message.reply('please provide the problem\n*Example*\n.report there is something wrong with .gpt command');
        return;
    }
    const chat = await message.getChat();
        try {
            const inviteCode = await chat.getInviteCode();
            inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
        } catch (error) {
            inviteLink = "UNKNOWN: either chat is private or bot is not admin"
        }
    const contact = await message.getContact();
    await message.reply('```Reported to the support group! My devs will work soon upon it. Thanks for reporting.☺️```'+`\n\n*Your report:*\n${utext}`)
    client.sendMessage('120363179001099439@g.us',`🀄 *Report recieved*\nfrom: ${inviteLink}\nuser: ${contact.number}\nreport: ${utext}`);
}

async function supportCommand(client, message) {
    await message.reply('```⭐Feel free to join our support group⭐```'+`\n\n*https://chat.whatsapp.com/E0XzCPRXoip16GVoG9yUV0*`);
}

async function idCommand(client, message){

    const chat = await message.getChat();
    if (!chat.isGroup) {
        message.reply("This chat's id is: "+`*${message.id.remote}*`);
        return;
    }

    const utext = await message.getMentions();
    const quotedMessage = await message.getQuotedMessage();
    if (!quotedMessage && utext.length === 0) {
        message.reply(`Group id: *${message.id.remote}*\nYour id: *${message.id.participant}*`);
        return;
    }

    if (quotedMessage){
        const contact = await quotedMessage.getContact();
        message.reply(`User *${contact.pushname}'s* id is: *${quotedMessage.author}*`)
    }

    if (utext.length !== 0){
        const id = utext[0].id._serialized;
        const contact = await client.getContactById(id)
        message.reply(`User *${contact.pushname}'s* id is: *${id}*`)
    }
}

module.exports = {
    promoteCommand,
    demoteCommand,
    kickCommand,
    inviteCommand,
    reportCommand,
    supportCommand,
    idCommand
  };
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
    const quotedMessage = await message.getQuotedMessage();
    if (!quotedMessage) {
        message.reply('Please reply to a user you want to promote.');
        return;
    }


    // Check if the replied user is already an admin
    const repliedUserId = quotedMessage.author;
    const isrepliedUserAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === repliedUserId && participant.isAdmin;
    });
    if (isrepliedUserAdmin) {
        quotedMessage.reply('User is already an admin.');
        return;
    }

    // Promote the replied user
    try {
        await chat.promoteParticipants([repliedUserId]);
        const contact = await quotedMessage.getContact();
        const user_name = contact.pushname;
        quotedMessage.reply(`User *${user_name}* [${repliedUserId}] has been promoted to admin.`);
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
    const quotedMessage = await message.getQuotedMessage();
    if (!quotedMessage) {
        message.reply('Please reply to a user you want to demote.');
        return;
    }


    // Check if the replied user is already an admin
    const repliedUserId = quotedMessage.author;
    const isrepliedUserAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === repliedUserId && participant.isAdmin;
    });
    if (!isrepliedUserAdmin) {
        quotedMessage.reply('User is already not an admin.');
        return;
    }

    // Demote the replied user
    try {
        await chat.demoteParticipants([repliedUserId]);
        const contact = await quotedMessage.getContact();
        const user_name = contact.pushname;
        quotedMessage.reply(`User *${user_name}* [${repliedUserId}] has been demoted to member.`);
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
    const quotedMessage = await message.getQuotedMessage();
    if (!quotedMessage) {
        message.reply('Please reply to a user you want to kick.');
        return;
    }


    // Check if the replied user is already an admin
    const repliedUserId = quotedMessage.author;
    const isrepliedUserAdmin = chat.participants.find((participant) => {
        return participant.id._serialized === repliedUserId && participant.isAdmin;
    });
    if (isrepliedUserAdmin) {
        quotedMessage.reply('User is an admin.');
        return;
    }

    // Demote the replied user
    try {
        await chat.removeParticipants([repliedUserId]);
        const contact = await quotedMessage.getContact();
        const user_name = contact.pushname;
        quotedMessage.reply(`User *${user_name}* [${repliedUserId}] has been kicked from the group.`);
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


async function reportCommand(client, message) {
    const utext = message.body.replace('.report ', '')
    let inviteLink;
    if(utext.trim()==".report"||utext.trim()=="report"){
        message.reply('please provide the problem\n*Example*\n.report there is something wrong with .gpt command')
    }
    const chat = await message.getChat();
        try {
            const inviteCode = await chat.getInviteCode();
            inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
        } catch (error) {
            inviteLink = "unknown either chat is private or bot is not admin"
        }
    const contact = await message.getContact();
    await message.reply('```Reported to the support group! My devs will work soon upon it. Thanks for reporting.☺️```'+`\n\n*Your report:*\n${utext}`)
    client.sendMessage('120363179001099439@g.us',`🀄 *Report recieved*\nfrom: ${inviteLink}\nuser: ${contact.number}\nreport: ${utext}`);
}

async function supportCommand(client, message) {
    await message.reply('```⭐Our support group⭐```'+`\n\n*https://chat.whatsapp.com/E0XzCPRXoip16GVoG9yUV0*`)
}

module.exports = {
    promoteCommand,
    demoteCommand,
    kickCommand,
    inviteCommand,
    reportCommand,
    supportCommand
  };
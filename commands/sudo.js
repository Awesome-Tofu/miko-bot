const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();


const uri = process.env.MONGODB_URI;
// Add sudo command
async function addsudoCommand(waclient, message) {
    if (message.author == `${process.env.OWNER_NUMBER}@c.us` || message.from == `${process.env.OWNER_NUMBER}@c.us`) {
        const chat = await message.getChat();
        await chat.sendStateTyping();
        const client = new MongoClient(uri);
        const quotedMsg = await message.getQuotedMessage();
        if (!chat.isGroup) {
            message.reply('This command only works in groups.');
            return;
        }
        if (!quotedMsg) {
            message.reply(`⚠️ Please reply to the user to add in sudo list.`);
            return;
        }
        try {
            await client.connect();
            const collection = client.db("SUDO").collection("users");
            const contactNumber = quotedMsg.author.replace('@c.us', '') || quotedMsg.from.replace('@c.us', '');
            const result = await collection.insertOne({ number: contactNumber });
            message.reply(`Added sudo user for number: ${contactNumber}`);
        } catch (error) {
            console.error(error);
            message.reply(`⚠️ Error:\n${error.message}`);
        } finally {
            await client.close();
        }
    } else {
        message.reply('⚠️ You do not have rights to do that');
        console.log(message.from + 'tried to access addsudo');
    }
    
}

// Delete sudo command
async function delsudoCommand(waclient, message) {
    if (message.author == `${process.env.OWNER_NUMBER}@c.us` || message.from == `${process.env.OWNER_NUMBER}@c.us`) {
        const chat = await message.getChat();
        await chat.sendStateTyping();
        const client = new MongoClient(uri);
        const quotedMsg = await message.getQuotedMessage();
        if (!chat.isGroup) {
            message.reply('This command only works in groups.');
            return;
        }
        if (!quotedMsg) {
            message.reply(`⚠️ Please reply to the user to remove from sudo list.`);
            return;
        }
        try {
            await client.connect();
            const collection = client.db("SUDO").collection("users");
            const contactNumber = quotedMsg.author.replace('@c.us', '') || quotedMsg.from.replace('@c.us', '');
            const result = await collection.deleteOne({ number: contactNumber });
            message.reply(`Removed sudo user for number: ${contactNumber}`);
        } catch (error) {
            console.error(error);
            message.reply(`⚠️ Error:\n${error.message}`);
        } finally {
            await client.close();
        }
    } else {
        message.reply('⚠️ You do not have rights to do that');
        console.log(message.from + 'tried to access delsudo');
    }

}

// List sudo commands
async function listsudoCommand(waclient, message) {
    const chat = await message.getChat();
    await chat.sendStateTyping();
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db("SUDO").collection("users");
        const senderNumber = message.author.replace('@c.us', '') || message.from.replace('@c.us', '');
        const sudoUser = await collection.findOne({ number: senderNumber });
        if (senderNumber !== process.env.OWNER_NUMBER && !sudoUser) {
            message.reply('⚠️ You do not have rights to do that');
            console.log(message.from + ' tried to access listsudo');
            return;
        }
        const sudoUsers = await collection.find().toArray();
        const sudoUserNumbers = sudoUsers.map(user => user.number).join(', ');
        if (!sudoUserNumbers) {
            message.reply(`No sudo users.`);
            return;
        }
        message.reply(`Sudo users: ${sudoUserNumbers}`);
    } catch (error) {
        console.error(error);
        message.reply(`⚠️ Error:\n${error.message}`);
    } finally {
        await client.close();
    }
}

// Check if user is sudo
async function isSudoUser(message) {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db("SUDO").collection("users");
        const senderNumber = message.author.replace('@c.us', '') || message.from.replace('@c.us', '');
        const sudoUser = await collection.findOne({ number: senderNumber });
        return sudoUser !== null;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await client.close();
    }
}

module.exports = {
    addsudoCommand,
    delsudoCommand,
    listsudoCommand,
    isSudoUser
};
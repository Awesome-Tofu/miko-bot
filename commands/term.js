const { exec } = require("child_process");
require("dotenv").config();
const { MessageMedia } = require('whatsapp-web.js');
const vm = require('vm');
const util = require('util');
const { isSudoUser } = require('./sudo');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function evalCommand(client, message, prefix) {
    if (message.author == `${process.env.OWNER_NUMBER}@c.us` || message.from == `${process.env.OWNER_NUMBER}@c.us` || await isSudoUser(message)) {
        try {
            const command = message.body.split(prefix + "eval")[1].trim();
            if (!command.trim()) {
                await message.reply(`⚠️ Please provide a command after "${prefix}eval" to execute.`);
                return;
            }
            if (command) {
                const start = Date.now();
                let result;
                let consoleOutput = '';
                try {
                    // Create a new script using the command, and run it in a new context
                    const script = new vm.Script(`(async () => { ${command} })()`);
                    const context = {
                        console: {
                            log: function(value) {
                                consoleOutput += util.inspect(value) + '\n';
                            }
                        },
                        message: message, // Add message to the context
                        client: client, // Add client to the context
                        require: require, // Add require to the context
                        MessageMedia: MessageMedia, // Add MessageMedia to the context
                        __dirname: __dirname, // Add __dirname to the context
                        __filename: __filename, // Add __filename to the context
                        fs: fs, // Add fs to the context
                        fetch: fetch, // Add fetch to the context
                    };
                    vm.createContext(context);
                    result = script.runInContext(context);
                } catch (error) {
                    result = error;
                }
                const end = Date.now();
                const timeTaken = end - start;
                const output = consoleOutput || util.inspect(result, { depth: 0 }); // Use util.inspect to convert the result to a string
                await message.reply(`📎 Input: ${command}\n\n📒 Output: ${output}\n\n✨ Taken Time: ${timeTaken}ms`);
            }
    } catch (error) {
        await message.reply(`⚠️ Error:\n${error.message}`);
    }
} else {
    message.reply('⚠️ You do not have rights to do that');
    console.log(message.from + ' tried to access eval');
}
}

async function termCommand(client, message, prefix) {
if(message.author == `${process.env.OWNER_NUMBER}@c.us`||message.from == `${process.env.OWNER_NUMBER}@c.us` || await isSudoUser(message)){
    const command = message.body.split(prefix + "term")[1].trim();
    if (!command.trim()){
        await message.reply(`⚠️ Please provide a command after "${prefix}term" to execute.`);
        return;
    }
    if (command) {
        // Execute the command using child_process
        exec(command, (error, stdout, stderr) => {
            if (error) {
                message.reply('⚠️ Error:\n' + error.message);
            } else if (stderr) {
                message.reply('⚠️ Error:\n' + stderr);
            } else {
                message.reply('👨‍💻 Command Output:\n' + stdout);
            }
        });
    } else {
        message.reply(`⚠️ Please provide a command after "${prefix}term" to execute.`);
    }
}else{
    message.reply('⚠️ You do not have rights to do that');
    console.log(message.from + 'tried to access term');
}
};

module.exports = { evalCommand, termCommand };
const { exec } = require("child_process");
require("dotenv").config();
const { MessageMedia } = require('whatsapp-web.js');
const vm = require('vm');
const util = require('util');
const { isSudoUser } = require('./sudo');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function evalFunc(command, client, message) {
    let consoleOutput = '';
    const console = {
        log: function() {
            consoleOutput += Array.from(arguments).join(' ') + '\n';
        },
        error: function() {
            consoleOutput += Array.from(arguments).join(' ') + '\n';
        },
        warn: function() {
            consoleOutput += Array.from(arguments).join(' ') + '\n';
        },
        info: function() {
            consoleOutput += Array.from(arguments).join(' ') + '\n';
        },
    };

    try {
        const script = new vm.Script(`(async () => { ${command} })()`);
        const context = vm.createContext({ 
            console, 
            fetch, 
            __dirname, 
            __filename, 
            fs, 
            process, 
            require,
            axios: require('axios'),
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            setInterval: setInterval,
            clearInterval: clearInterval,
            MessageMedia: MessageMedia,
            client: client,
            message: message,
        });
        const start = Date.now();
        let result;
        try {
            result = await script.runInContext(context);
        } catch (error) {
            result = error;
        }
        const end = Date.now();
        const timeTaken = end - start;
        const output = consoleOutput || util.inspect(result, { depth: 0 });
        const finalOut = `📎 Input: ${command}\n\n📒 Output: ${output}\n\n✨ Taken Time: ${timeTaken}ms`;
        return finalOut;
    } catch (error) {
        const finalOut = `⚠️ Error:\n${error}`;
        return finalOut;
    }
}


async function evalCommand(client, message, prefix) {
    if (message.author == `${process.env.OWNER_NUMBER}@c.us` || message.from == `${process.env.OWNER_NUMBER}@c.us` || await isSudoUser(message)) {
        try {
            const command = message.body.split(prefix + "eval")[1].trim();
            if (!command.trim()) {
                await message.reply(`⚠️ Please provide a command after "${prefix}eval" to execute.`);
                return;
            }
            if (command) {
                const result = await evalFunc(command, client, message);
                await message.reply(result);
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

const { exec } = require("child_process");
require("dotenv").config();


module.exports = async function termCommand(client, message) {

if(message.author == `${process.env.OWNER_NUMBER}@c.us`||message.from == `${process.env.OWNER_NUMBER}@c.us`){
    const command = message.body.replace('.term', '').trim();

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
        message.reply('⚠️ Please provide a command after ".term" to execute.');
    }
}else{
    message.reply('⚠️ You do not rights to do that');
    console.log(message.from);
}
};

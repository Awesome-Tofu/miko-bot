const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = async function pingCommand(client, message) {
    try {
        // Get basic ping response (Linux and Windows)
        const pingCommand = process.platform === 'win32' ? 'ping -n 3 google.com' : 'ping -c 3 google.com';
        const pingResponse = await exec(pingCommand);

        // Get system information (Linux and Windows)
        const systemCommand = process.platform === 'win32' ? 'systeminfo' : 'uname -a';
        const systemInfo = await exec(systemCommand);

        // Get network information (Linux and Windows)
        const networkCommand = process.platform === 'win32' ? 'ipconfig' : 'ifconfig';
        const networkInfo = await exec(networkCommand);

        // Extract relevant information from the command outputs
        const pingResult = pingResponse.stdout;
        const systemResult = systemInfo.stdout;
        const networkResult = networkInfo.stdout;

        // Create a detailed reply
        const replyMessage = `
Pong! 🏓\n
*Ping Result:*\n${pingResult}\n
*System Information:*\n${systemResult}\n
*Network Information:*\n${networkResult}
        `;

        // Send the detailed reply
        await message.reply(replyMessage);
    } catch (error) {
        console.error('Error fetching ping information:', error);
        message.reply('An error occurred while fetching ping information.');
    }
};

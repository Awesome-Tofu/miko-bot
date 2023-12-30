const os = require('os');
const ms = require('ms');

module.exports = async function pingCommand(client, message) {
    try {
        const start = Date.now();
        const end = Date.now();

        const uptime = os.uptime();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const cpuUsage = os.loadavg()[0];
        const diskUsage = (totalMem - freeMem) / totalMem;

        const response = `🏓 ᴩᴏɴɢ : ${(end - start).toFixed(3)}ᴍs\n\nᴍɪᴋᴏ sʏsᴛᴇᴍ sᴛᴀᴛs :\n\n↬ ᴜᴩᴛɪᴍᴇ : ${ms(uptime * 1000, { long: true })}\n↬ ʀᴀᴍ : ${(1 - freeMem / totalMem) * 100}%\n↬ ᴄᴩᴜ : ${cpuUsage * 100}%\n↬ ᴅɪsᴋ : ${diskUsage * 100}%`;
            // Store the Promise returned by message.reply in a variable
        const replyPromise = message.reply(response);

        // Add a catch handler to the Promise to handle any errors
        replyPromise.catch(error => {
            console.error('Error sending message:', error);
        });

        // Wait for the Promise to resolve before continuing
        await replyPromise;
    } catch (error) {
        console.error('Error fetching ping information:', error);
        await message.reply('An error occurred while fetching ping information.'+ `\n\n${error.message}`);
    }
};
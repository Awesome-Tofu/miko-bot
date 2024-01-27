require('dotenv').config();
const axios = require('axios');


module.exports = async function truecallerCommand(client, message, prefix) {
    const utext = message.body.split(prefix + "truecaller")[1];
    if (!utext) {
        await message.reply('No query!\nExample: ' + prefix + 'truecaller +919876543210');
        return;
    }
    let result;
    const contactNumber = message.author == undefined ? message.from.replace('@c.us', '') : message.author.replace('@c.us', '');
    try {
        const phoneNumber = `+${utext.replace(/\s+/g, '').replace('+', '')}`;
        const installationId = process.env.INSTALLATION_ID;
        if (!installationId) {
            if (contactNumber == process.env.OWNER_NUMBER) {
                await message.reply('Please set your ```INSTALLATION_ID``` in your environment variable to run this command\nGet you installation ID from \nhttps://replit.com/@E-Venture/truecaller-installation-id?v=1');
                return;
            }else {
                await message.reply('Sorry, this command is currently not availble. Please contact the bot owner.');
                return;
            }
        }
        const response = await axios(`https://truecaller-search-api.vercel.app/?phone=${phoneNumber}&installationID=${installationId}`);
        result = response.data;
        let msgreply = `
*Name:* ${result.name}
*a.k.a:* ${result.alternateName}
*Email:* ${result.email}
*Country:* ${result.countryDetails.name} ${result.countryDetails.flag}
*Address:* ${result.addresses[0].city}, ${result.addresses[0].countryCode}`;
        if(result.addresses[0].street){
            msgreply += `\n*Street:* ${result.addresses[0].street}\n`;
        }
        if(result.addresses[0].zip){
            msgreply += `\n*Zip:* ${result.addresses[0].zip}\n`;
        }
        await message.reply(msgreply);
    } catch (error) {
        console.error(error);
        await message.reply('Error! Cannot search the phone number' + `\n${error.message}`);
    }
}
require('dotenv').config()
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function ownerCommand(client, message) {
  const owner = process.env.OWNER_NUMBER;
  const contact = await client.getContactById(owner + '@c.us');
  await message.reply(contact);
}

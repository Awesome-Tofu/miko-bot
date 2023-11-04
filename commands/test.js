const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function testCommand(client, message) {

  message.reply('test')
}

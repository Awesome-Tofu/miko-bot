const { findLangName } = require('../utils/tr_lang');




module.exports = async function trCommand(client, message) {
    let quotedMsg = await message.getQuotedMessage();
    console.log(quotedMsg);
    message.reply('OK')
  }




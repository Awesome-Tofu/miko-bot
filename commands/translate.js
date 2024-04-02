const { findLangName } = require('../utils/tr_lang');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();


module.exports = async function trCommand(client, message, prefix) {
  try{
    let utext = message.body.split(prefix + "tr")[1].trim();
    let quotedMsg = await message.getQuotedMessage();
    if(!utext){
        utext = process.env.DEFAULT_LANGUAGE|| 'en';
    }
      const repliedText = quotedMsg._data.body;
      const response = await fetch(`https://apis-awesome-tofu.koyeb.app/api/translate?q=${repliedText}&to=${utext || process.env.DEFAULT_LANGUAGE ||findLangName(utext)}`);
      const data = await response.json();
      const translatedText = data.text;
      const detectedLang = findLangName(data.from);
      await message.reply(`*translated from* _${detectedLang}_ *to* _${findLangName(utext)}_\n\n${translatedText}`);
  }catch(error){
    await message.reply('*There was an error while running this command.*\nError could be:\n 💀Internal error\n 🤡Incorrect language format\n 😡You did not replied to any text bruhh!');
  }

  }




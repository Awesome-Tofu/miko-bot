const { findLangName } = require('../utils/tr_lang');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();


module.exports = async function trCommand(client, message) {
  try{
    let quotedMsg = await message.getQuotedMessage();
    let utext = message.body.replace('.tr ','') || process.env.DEFAULT_LANGUAGE;
    if(utext=='.tr'){
        utext = 'en'
    }
      const repliedText = quotedMsg._data.body;
      const response = await fetch(`https://translate-api-gray.vercel.app//translate?q=${repliedText}&lang=${utext || process.env.DEFAULT_LANGUAGE ||findLangName(utext)}`);
      const data = await response.json();
      const translatedText = data.text;
      const detectedLang = findLangName(data.from);
      await message.reply(`*translated from* _${detectedLang}_ *to* _${findLangName(utext)}_\n\n${translatedText}`);
  }catch(error){
    await message.reply('*There was an error while running this command.*\nError could be:\n 💀Internal error\n 🤡Incorrect language format\n 😡You did not replied to any text bruhh!');
  }

  }




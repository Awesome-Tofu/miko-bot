const axios = require("axios");

async function shortenUrl(Url) {
    try {
      const response = await axios.get('https://api.erdwpe.com/api/linkshort/tinyurl', {
        params: {
          link: Url,
        },
      });
  
      if (response.data.status === true) {
        // Return the shortened URL if the request is successful
        return response.data.result;
      } else {
        // Handle the case where the API request was not successful
        console.error('TinyURL API request failed:', response.data);
        return null;
      }
    } catch (error) {
      // Handle network or other errors
      message.reply('```Error```\n'+`${error.message}`);
      console.error('Error shortening URL:', error);
      return null;
    }
  }


  module.exports = async function tinyCommand(client, message, prefix){
    try{
        const nocmd = message.body.split(prefix + "tiny")[1];
        const utext = message.body.replace(prefix + 'tiny ', '').trim();
        if(!nocmd.trim()){
            await message.reply("No Query!");
            return;
        }else{
            const link = await shortenUrl(utext);
            await message.reply("```Shortened link🔗```\n\n"+link);
        }
    }catch(err){
        console.error(err);
        message.reply('```Error```\n'+`${err.message}`);
    }
  }

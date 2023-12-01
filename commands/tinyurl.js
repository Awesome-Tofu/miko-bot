const axios = require("axios");

async function shortenUrl(videoUrl) {
    try {
      const response = await axios.get('https://api.erdwpe.com/api/linkshort/tinyurl', {
        params: {
          link: videoUrl,
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


  module.exports = async function tinyCommand(client, message){
    try{
        const utext = message.body.replace('.tiny ', '').trim();
        if(!utext){
            await message.reply("No Query!");
        }else{
            const link = await shortenUrl(utext);
            await message.reply("```Shortened link🔗```\n\n"+link);
        }
    }catch(err){
        console.error(err);
        message.reply('```Error```\n'+`${err.message}`);
    }
  }

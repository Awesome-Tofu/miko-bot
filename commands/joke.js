const axios = require('axios');

module.exports = async function jokeCommand(client, message, prefix) {
    const utext = message.body.split(prefix + "joke")[1];
    let jokeapi = 'https://v2.jokeapi.dev/joke/any';
    try {

        const jokeCategories = ["any", "misc", "programming", "dark", "pun", "spooky", "christmas"];
        if(utext.trim()){
            if(jokeCategories.includes(utext.trim())){
                jokeapi = jokeapi.replace('any', '') + utext.trim();
            }else{
                message.reply('Invalid joke type!\n you can try these categories:\n' + jokeCategories.join(', '));
                return;
            }
        }
        console.log(jokeapi);
        const response = await axios.get(jokeapi);
        const data = response.data;
        console.log(data);
        if (data.joke){
            await message.reply(data.joke);
            return;
        }
        const setupMsg = await message.reply(data.setup);
        if (data.delivery) {
            setTimeout(async () => {
                await setupMsg.reply(data.delivery);
            }, 5000);  
        }

    } catch (error) {
        message.reply('Error'+ `\n${error}`);
    }
}

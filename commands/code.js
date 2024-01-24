const axios = require('axios');

module.exports = async function codeCommand(client, message, prefix) {
    let utext = message.body.split(prefix + "code")[1].trim();
    
    if(!utext.trim()){
        await message.reply(`No query!\nExample: ${prefix}code write code to create loop in nodejs`)
        return;
    }

    const writing = await message.reply('Writing...');
        try{
            const response = await axios.post(`https://api.qewertyy.me/models?model_id=23&prompt=${encodeURIComponent(utext)}`, {}, {
                headers: {
                    'accept': 'application/json'
                }
            });
            const data = response.data.content;
            await writing.edit(data[0].text);
        
        }catch(error){
            writing.edit('Something went wrong.\n'+ `${error.message}`);
        }
}

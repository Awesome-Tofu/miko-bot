const axios = require('axios');

async function palmCommand(client, message, prefix) {
    let utext = message.body.split(prefix + "palm")[1].trim();
    
    if(!utext.trim()){
        await message.reply(`No query!\nExample: ${prefix}palm write code to create loop in nodejs`)
        return;
    }

    const writing = await message.reply('Writing...');
        try{
            const response = await axios.post(`https://api.qewertyy.dev/models?model_id=23&prompt=${encodeURIComponent(utext)}`, {}, {
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

async function codeCommand(client, message, prefix) {
    let utext = message.body.split(prefix + "code")[1].trim();
    
    if(!utext.trim()){
        await message.reply(`No query!\nExample: ${prefix}code write html, css and js code to create a simple snake game`)
        return;
    }

    const writing = await message.reply('Writing...');
        try{
            const response = await axios.get(`https://tofu-node-apis.onrender.com/api/blackbox?q=${encodeURIComponent(utext)}`);
            const data = response.data.reply;
            await writing.edit(data);
        }catch(error){
            writing.edit('Something went wrong.\n'+ `${error.message}`);
        }
}

module.exports = {codeCommand, palmCommand};
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


module.exports = async function codeCommand(client, message, prefix) {
    let utext = message.body.split(prefix + "code")[1].trim();
    
    if(!utext.trim()){
        await message.reply(`No query!\nExample: ${prefix}code write code to create loop in nodejs`)
        return;
    }

    const writing = await message.reply('Writing...');
        try{
            const response = await fetch(`https://api.qewertyy.me/models?model_id=1&prompt=${encodeURIComponent(utext)}`);
            const data = await response.json();
            const respon = await data.content;
            await writing.edit(respon);
        
        }catch(error){
            writing.edit('Something went wrong.');
        }
}

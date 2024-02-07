const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


async function gptCommand(client, message, prefix) {
    let utext = message.body.split(prefix + "gpt")[1].trim();
    if(!utext.trim()){
        await message.reply('No query!');
        return;
    }
    const writing = await message.reply('Writing...');
        try{
            const response = await fetch('https://api.qewertyy.dev/models?model_id=5&prompt='+encodeURIComponent(utext), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            const respon = await data.content;
            await writing.edit(respon);
        }catch(error){
            writing.edit('Something went wrong.');
        }
}

module.exports = gptCommand;
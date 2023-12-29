const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


async function gptCommand(client, message) {
    let utext = message.body.replace('.gpt ','');
    const writing = await message.reply('Writing...');
        try{
            if(utext=='.gpt'){
                await writing.edit('No query!')
            }else{
                const response = await fetch(`https://vihangayt.me/tools/chatgpt?q=${utext}`);
                const data = await response.json();
                const respon = await data.data;
                await writing.edit(respon);
            }
        }catch(error){
            writing.edit('Something went wrong.');
        }
}

async function gpt5Command(client, message){
    let utext = message.body.replace('.gpt5 ','');
    const writing = await message.reply('Writing...');
    try{
        if(utext=='.gpt5'){
            await writing.edit('No query!')
        }else{
            const response = await fetch(`https://api.yanzbotz.my.id/api/ai/gpt5?query=${utext}&content=you%20are%20chatting%20on%20whatsapp%20which%20were%20created%20by%20Awesome%20Tofu`);
            const data = await response.json();
            const respon = await data.result;
            await writing.edit(respon);
        }
    }catch(error){
        writing.edit('Something went wrong.');
    }
}

module.exports = {
    gptCommand,
    gpt5Command
  };
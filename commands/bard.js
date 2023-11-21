const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


module.exports = async function bardCommand(client, message) {
    let utext = message.body.replace('.bard ','');
        try{
            if(utext=='.bard'){
                await message.reply('No query!')
            }else{
                const identity = "You are bard, but your name is Miko and you are female, chatting with user in Whatsapp\nUser:"
                const response = await fetch(`https://vihangayt.me/tools/bard?q=${identity}${utext}`);
                const data = await response.json();
                const respon = await data.data;
                await message.reply(respon.replace('Miko:',''));
            }
        }catch(error){
            message.reply('Something went wrong.');
        }
}

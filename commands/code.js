const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


module.exports = async function codeCommand(client, message) {
    let utext = message.body.replace('.code ','');
        try{
            if(utext=='.code'){
                await message.reply('No query!\nExample: .code write code to create loop in nodejs')
            }else{
                const response = await fetch(`https://vihangayt.me/tools/blackbox?q=${utext}`);
                const data = await response.json();
                const respon = await data.data;
                await message.reply(respon);
            }
        }catch(error){
            message.reply('Something went wrong.');
        }
}

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


module.exports = async function codeCommand(client, message) {
    let utext = message.body.replace('.code ','');
    const writing = await message.reply('Writing...');
        try{
            if(utext=='.code'){
                await writing.edit('No query!\nExample: .code write code to create loop in nodejs')
            }else{
                const response = await fetch(`https://tofuapi.onrender.com/chat/palm/${encodeURIComponent(utext)}`);
                const data = await response.json();
                const respon = await data.content;
                await writing.edit(respon);
            }
        }catch(error){
            writing.edit('Something went wrong.');
        }
}

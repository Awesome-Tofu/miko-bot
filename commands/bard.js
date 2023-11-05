const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


module.exports = async function bardCommand(client, message) {
    let utext = message.body.replace('.bard ','');
        try{
            if(utext=='.bard'){
                await message.reply('No query!')
            }else{
                const response = await fetch(`https://api.akuari.my.id/ai/gbard?chat=${utext}`);
                const data = await response.json();
                const respon = await data.respon;
                const trresponse = await fetch(`https://translate-api-gray.vercel.app/translate?q=${utext}&lang=en`);
                const trdata = await trresponse.json();
                const fromtranslatedText = await trdata.from;
                const resp = await fetch(`https://translate-api-gray.vercel.app/translate?q=${respon}&lang=${fromtranslatedText}`);
                const respdata = await resp.json();
                const finalData = await respdata.text;
                await message.reply(finalData);
            }
        }catch(error){
            message.reply('Something went wrong.');
        }
}

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


module.exports = async function gptCommand(client, message) {
    let utext = message.body.replace('.gpt ','');
        try{
            if(utext=='.gpt'){
                await message.reply('No query!')
            }else{
                const response = await fetch(`https://api.akuari.my.id/ai/gpt?chat=${utext}`);
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

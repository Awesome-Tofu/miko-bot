const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function pasteCommand(client, message) {
    try {
        const utext = message.body.replace('.paste ', '').trim();
        if(utext.trim() == '.paste' && !message.hasQuotedMsg){
            await message.reply("No Query!");
            return;
        }else if(message.hasQuotedMsg){
            let quotedMsg = await message.getQuotedMessage();
            let query = encodeURIComponent(quotedMsg.body); // Encode the text for the API request
            const response = await fetch(`https://pasteb.vercel.app/paste?q=${query}`)
            const data = await response.json();
            console.log(data.SpaceBinLink);
            await message.reply("```Pasted link🔗```\n\n"+data.SpaceBinLink); 
        }else{
            const response = await fetch(`https://pasteb.vercel.app/paste?q=${encodeURIComponent(utext)}`)
            const data = await response.json();
            console.log(data.SpaceBinLink);
            await message.reply("```Pasted link🔗```\n\n"+data.SpaceBinLink);
        }
    } catch (error) {
        message.reply('error');
    }
}

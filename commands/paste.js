const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function pasteCommand(client, message, prefix) {
    try {
        const utext = message.body.split(prefix + "paste")[1]
        if(!utext.trim() && !message.hasQuotedMsg){
            await message.reply("No Query! Reply to the message or provide a query after command");
            return;
        }else if(message.hasQuotedMsg){
            let quotedMsg = await message.getQuotedMessage();
            let query = encodeURIComponent(quotedMsg.body); 
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
        message.reply('error'+`\n\n${error.message}`);
    }
}

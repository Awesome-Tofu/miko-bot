const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function pasteCommand(client, message) {
    const utext = message.body.replace('.paste ', '').trim();
    if(!utext){
        await message.reply("No Query!");
    }else{
        const response = await fetch(`https://pasteb.vercel.app/paste?q=${encodeURIComponent(utext)}`)
        const data = await response.json();
        console.log(data.SpaceBinLink);
        await message.reply("```Pasted link🔗```\n\n"+data.SpaceBinLink);
    }
}

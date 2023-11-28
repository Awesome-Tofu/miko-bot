const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require("dotenv").config();

module.exports = async function restartCommand(client, message) {
    try {
        if(message.author == `${process.env.OWNER_NUMBER}@c.us`||message.from == `${process.env.OWNER_NUMBER}@c.us`){
        const deployHook = process.env.DEPLOY_HOOK;
        await message.reply('restarting...')
        const response = await fetch(deployHook);
        const data = response.json();
        console.log(data);
        // await message.reply('Redeploying with id\n'+data.deploy.id);
        }else{
            message.reply('You are not the owner!');
        }
        
    } catch (error) {
        message.reply('```Error```\n'+`${error.message}`);
    }
}
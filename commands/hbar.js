const { MessageMedia } = require('whatsapp-web.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const axios = require('axios');


async function trending() {
    try {
        const response = await fetch('https://hentaibar-api.onrender.com/trending/1');
        const data = await response.json();
        const formattedNames = data.results.map(result => `➥${result.name}`).join('\n');
        return formattedNames;
    } catch (error) {
        console.error('trending err', error);
        return 'Error';
    }
}

async function get(tag) {
    try {
        const response = await fetch(`https://hentaibar-api.onrender.com/tags/${tag}/1`);
        const data = await response.json();
        const formattedNames = data.results.map(result => `➥${result.name}`).join('\n');
        return formattedNames;
    } catch (error) {
        console.error('trending err', error);
        return 'Error';
    }
}

async function tags(){
    try {
        const response = await fetch('https://hentaibar-api.onrender.com/tags/');
        const data = await response.json();
        const formattedTags = data.tags.map(tag => `➥${tag}`).join('\n');
        return formattedTags;
    } catch (error) {
        console.error('trending err', error);
        return 'Error';
    }
}

async function search(name){
    try {
        const response = await fetch(`https://hentaibar-api.onrender.com/search/${name}/1`);
        const data = await response.json();
        const formattedNames = data.results.map(result => `➥${result.name}`).join('\n');
        return formattedNames;
        // console.log(formattedNames);
    } catch (error) {
        console.error('search err', error);
        return 'Error';
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  


async function hrandom() {
    try {
        const randomNum = getRandomNumber(112, 123);
        const response = await fetch(`https://hentaibar-api.onrender.com/longest/${randomNum}`);
        const data = await response.json();
        const randomIndex = getRandomNumber(0, data.results.length - 1);
        const randomUrlObject = data.results[randomIndex].url;
        const resp = await fetch(randomUrlObject);
        const deta = await resp.json();

        const sizeInMB = await getVideoSize(deta.file);
        const jsonReturn = {
            name:deta.name,
            video:deta.file,
            duration:deta.duration,
            size: sizeInMB
        }
        return jsonReturn;
        // console.log(jsonReturn);
    } catch (error) {
        console.error('random err', error);
        return 'Error';
    }
}

async function watch(name){
    try {
        const response = await fetch(`https://hentaibar-api.onrender.com/search/${name}/1`); // Replace with your actual API endpoint
        const data = await response.json();

        // Check if there are any results
        if (data.results.length === 0) {
            console.log('No results found.');
            return;
        }

        // Get a random index
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomUrl = data.results[randomIndex].url;
        
        const resp = await fetch(randomUrl);
        const deta = await resp.json();
        const jresp = {
            name: deta.name,
            duration: deta.duration,
            video: deta.file
        }
        // console.log(jresp);
        return jresp;
    } catch (error) {
        console.error('Error fetching watch data:', error);
    }
}

async function getVideoSize(url) {
    try {
      const response = await axios.head(url);
  
      if (response.status === 200) {
        const sizeInBytes = parseInt(response.headers['content-length'], 10);
        const sizeInMB = Math.floor(sizeInBytes / 1024 / 1024) // Convert to MB
      //   console.log(`The size of the video is ${sizeInMB} MB.`);
        return sizeInMB;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

module.exports = async function hbarCommand(client, message, prefix) {
    try{
const utext = message.body.split(prefix + "hbar")[1];
const words = utext.trim().split(' ');
if(!utext.trim()){
    const availableCmds = `These are the availabe commands\n\n\n${prefix}hbar trending\n\n${prefix}hbar random\n\n${prefix}hbar tags\n\n${prefix}hbar get <tag>(.eg loli)\n\n${prefix}hbar watch <name>(.eg overflow)`;
    message.reply(availableCmds);
}else if(utext.trim()=="trending"){
    const trendings = await trending();
    await message.reply(`Trending\n\n${trendings}`);
}else if(utext.trim()=="random"){
    const scraping = await message.reply('```Scraping...```');
    try {
        const vidrandomdata = await hrandom();
        const videoFile = vidrandomdata.video;
        const name = vidrandomdata.name;
        const duration = vidrandomdata.duration;

        // const fileSizeInMB = media.filesize / (1024 * 1024); // Convert bytes to megabytes
        const fileSizeInMB = await getVideoSize(videoFile);
        // console.log(fileSizeInMB);
        if (fileSizeInMB < 60) {
            // console.log('less');
            const caption = `*Title:* ${name}\n*Size:* ${fileSizeInMB} MB\n*Duration:* ${duration}`;
            await scraping.edit('```Uploading...```');
            const media = await MessageMedia.fromUrl(videoFile, { unsafeMime: true });
            await client.sendMessage(message.from, media, {
                caption: caption,
            });
            await scraping.delete(true);
        } else {
            // console.log('more');
            const linkMessage = `*Title:* ${name}\n*Link:* ${videoFile}\n*Size:* ${fileSizeInMB} MB\n*Duration:* ${duration}`;
            await message.reply(linkMessage);
        }
    } catch (error) {
        message.reply('```Error```\n',`${error.message}`);
        console.error(error);
    }

}else if(words[0]=="get"){
    words.shift();
    const tag = words.join(' ');
    const tagNames = await get(tag);
    await message.reply(`Available videos for ${tag}:\n *${tagNames}*`)
}else if(words[0]=="search"){
    words.shift();
    const name = words.join(' ');
    const fetchnames = await search(name);
    await message.reply(`Search Result\n${fetchnames}`)
}else if(words[0]=="watch"){
    words.shift();
    const name = words.join(' ');
    const scraping = await message.reply('```Scraping...```');
    const vidrandomdata = await watch(name);
    try {
        const videoFile = vidrandomdata.video;
        const name = vidrandomdata.name;
        const duration = vidrandomdata.duration;

        const fileSizeInMB = await getVideoSize(videoFile);
        // console.log(fileSizeInMB);
        if (fileSizeInMB < 58) {
            // console.log('less');
            const caption = `*Title:* ${name}\n*Size:* ${fileSizeInMB} MB\n*Duration:* ${duration}`;
            await scraping.edit('```Uploading...```');
            const media = await MessageMedia.fromUrl(videoFile, { unsafeMime: true });
            await client.sendMessage(message.from, media, {
                caption: caption,
            });
            await scraping.delete(true);
        } else {
            // console.log('more');
            const linkMessage = `*Title:* ${name}\n*Link:* ${videoFile}\n*Size:* ${fileSizeInMB} MB\n*Duration:* ${duration}`;
            await message.reply(linkMessage);
        }
    } catch (error) {
        message.reply('```Error```\n',`${error.message}`);
        console.error(error);
    }
}else if(words[0]=="tags"){
    let all_tags = await tags();
    await message.reply(`Available Tags\n\n${all_tags}`);
}else if(words[0]=="cls"){
    const response = await fetch('https://hentaibar-api.onrender.com/delall/');
    const data = await response.json();
    await message.reply(`cleared videos\n\n${data.status.replace('Cleared ','')}`);
}
}catch(error){
        console.error(error);
        await message.reply("something went wrong ```001```")
    }
}
// I'm Biginner 

const ytdl = require('ytdl-core');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

module.exports = async function AudioDownloadYouTube(client, message) {
        let url = message.body.replace('.audio ','');
        try {
            if(url=='.audio')
            {
                await message.reply('No query!')
            }
            else
            {
                let info = await ytdl.getInfo(url);
                let data = 
                {
                "channel": {
                    "name": info.videoDetails.author.name,
                    "user": info.videoDetails.author.user,
                    "channelUrl": info.videoDetails.author.channel_url,
                    "userUrl": info.videoDetails.author.user_url,
                    "verified": info.videoDetails.author.verified,
                    "subscriber": info.videoDetails.author.subscriber_count
                },
                "video": {
                    "title": info.videoDetails.title,
                    "description": info.videoDetails.description,
                    "lengthSeconds": info.videoDetails.lengthSeconds,
                    "videoUrl": info.videoDetails.video_url,
                    "publishDate": info.videoDetails.publishDate,
                    "viewCount": info.videoDetails.viewCount
                }
                }
                ytdl(url, { filter: 'audioonly', format: 'mp3', quality: 'highest' }).pipe(fs.createWriteStream(`./commands/audio_dl/download.mp3`)).on('finish', async () => {
                  const media = await MessageMedia.fromFilePath(`./commands/audio_dl/download.mp3`);
                  media.filename = `${data.video.title}.mp3`;
                  await client.sendMessage(message.from, media, { sendMediaAsDocument: true });
                  client.sendMessage(message.from, `• Title : *${data.video.title}*\n• Channel : *${data.channel.user}*\n• View Count : *${data.video.viewCount}*`);
                  client.sendMessage(message.from, '*[✅]* Successfully!');
            });
        }
    }catch(error){
            console.log(error);
            message.reply('Something went wrong.');
        }

}


module.exports = async function VideoDownloadYouTube(client, message) {
        let url = message.body.replace('.video ','');
        try {
            if(url=='.video')
            {
                await message.reply('No query!')
            }
            else
            {
                let info = await ytdl.getInfo(url);
                let data = 
                {
                "channel": {
                    "name": info.videoDetails.author.name,
                    "user": info.videoDetails.author.user,
                    "channelUrl": info.videoDetails.author.channel_url,
                    "userUrl": info.videoDetails.author.user_url,
                    "verified": info.videoDetails.author.verified,
                    "subscriber": info.videoDetails.author.subscriber_count
                },
                "video": {
                    "title": info.videoDetails.title,
                    "description": info.videoDetails.description,
                    "lengthSeconds": info.videoDetails.lengthSeconds,
                    "videoUrl": info.videoDetails.video_url,
                    "publishDate": info.videoDetails.publishDate,
                    "viewCount": info.videoDetails.viewCount
                }
                }
                ytdl(url, { filter: 'audioandvideo', format: 'mp4', quality: 'highest' }).pipe(fs.createWriteStream(`./commands/audio_dl/download.mp3`)).on('finish', async () => {
                  const media = await MessageMedia.fromFilePath(`./commands/audio_dl/download.mp4`);
                  media.filename = `${data.video.title}.mp4`;
                  await client.sendMessage(message.from, media, { sendMediaAsDocument: true });
                  client.sendMessage(message.from, `• Title : *${data.video.title}*\n• Channel : *${data.channel.user}*\n• View Count : *${data.video.viewCount}*`);
                  client.sendMessage(message.from, '*[✅]* Successfully!');
            });
        }
    }catch(error){
            console.log(error);
            message.reply('Something went wrong.');
        }

}


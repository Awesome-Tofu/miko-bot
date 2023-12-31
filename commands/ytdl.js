//Thanks to @ThiruXD for youtube audio and video modules

const ytdl = require('ytdl-core');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');



// YOUTUBE AUDIO DOWNLOADER
async function AudioDownloadYouTube(client, message, prefix) {
    let url = message.body.split(prefix + "audio")[1].trim();
    try {
        if(!url.trim())
        {
            await message.reply('No query!');
            return;
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
              media.filename = `youtubedl.mp3`;
              message.reply('```Please be patient while the audio is downloading...```');
              const caption = `• Title : *${data.video.title}*\n• Channel : *${data.channel.user}*\n• View Count : *${data.video.viewCount}*`
              await client.sendMessage(message.from, media, { caption:caption,sendMediaAsDocument: true });
              await processAudio(client, message, './commands/audio_dl/download.mp3');
        });
    }
}catch(error){
        console.log(error);
        message.reply('Something went wrong.');
    }
}




async function processAudio(client, message, inputFilePath) {
    try {
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(inputFilePath)
                .audioChannels(1)
                .audioCodec('opus')
                .toFormat('ogg')
                .addOutputOptions('-avoid_negative_ts make_zero')
                .on('end', resolve)
                .on('error', reject)
                .save(`./commands/audio_dl/processed.ogg`);
        });

        // Create MessageMedia from the processed audio
        const media = await MessageMedia.fromFilePath(`./commands/audio_dl/processed.ogg`);
        media.filename = `youtubedl.ogg`;

        // Send the processed audio as a voice message
        await client.sendMessage(message.from, media, { ptt: true });
    } catch (error) {
        console.error('Error processing audio:', error);
    }
}


async function GetYouTubeInfo(client, message, prefix) {
    let url = message.body.split(prefix + "detail")[1].trim();
    try {
        if(!url.trim())
        {
            await message.reply('No query!')
            return;
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
            client.sendMessage(message.from, `*CHANNEL DETAILS*\n• Name : *${data.channel.name}*\n• User : *${data.channel.user}*\n• Verified : *${data.channel.verified}*\n• Channel : *${data.channel.channelUrl}*\n• Subscriber : *${data.channel.subscriber}*`);
            client.sendMessage(message.from, `*VIDEO DETAILS*\n• Title : *${data.video.title}*\n• Seconds : *${data.video.lengthSeconds}*\n• VideoURL : *${data.video.videoUrl}*\n• Publish : *${data.video.publishDate}*\n• Viewers : *${data.video.viewCount}*`)
            client.sendMessage(message.from, '*[✅]* Success!');
        }
    }catch(error){
            console.log(error);
            message.reply('Something went wrong.');
        }

}


// Export all the functions in an object
module.exports = {
  AudioDownloadYouTube,
  GetYouTubeInfo
};

// I'm Biginner 

const ytdl = require('ytdl-core');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

// YOUTUBE LINK INFORMATION COLLECTOR

module.exports = async function GetYouTubeInfo(client, message) {
        let url = message.body.replace('.detail ','');
        try {
            if(url=='.detail')
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
                client.sendMessage(message.from, `*CHANNEL DETAILS*\n• Name : *${data.channel.name}*\n• User : *${data.channel.user}*\n• Verified : *${data.channel.verified}*\n• Channel : *${data.channel.channelUrl}*\n• Subscriber : *${data.channel.subscriber}*`);
                client.sendMessage(message.from, `*VIDEO DETAILS*\n• Title : *${data.video.title}*\n• Seconds : *${data.video.lengthSeconds}*\n• VideoURL : *${data.video.videoUrl}*\n• Publish : *${data.video.publishDate}*\n• Viewers : *${data.video.viewCount}*`)
                client.sendMessage(message.from, '*[✅]* Successfully!');
        }
    }catch(error){
            console.log(error);
            message.reply('Something went wrong.');
    }
}




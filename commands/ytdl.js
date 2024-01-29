//Thanks to @ThiruXD for youtube audio and video modules

const ytdl = require('ytdl-core');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');

// YOUTUBE AUDIO DOWNLOADER
async function AudioDownloadYouTube(client, message, prefix) {
    let url = message.body.split(prefix + "song")[1].trim();

    try {
        if (!url.trim()) {
            await message.reply('No query!');
            return;
        }
        else {
            const processing = await message.reply('```Please be patient while the audio is downloading...```');
            if (url.startsWith('https://')) {
                url = url;
            } else {
                const response = await axios(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&key=AIzaSyCqcwglCnBbIBhkZ5o8Poek_Jxzd3tknK8&q=${url.trim()}`);
                const data = response.data.items[0].id.videoId;
                url = `https://www.youtube.com/watch?v=${data}`;
            }
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
                    "thumbnail": info.videoDetails.thumbnails[0].url,
                    "title": info.videoDetails.title,
                    "description": info.videoDetails.description,
                    "lengthSeconds": info.videoDetails.lengthSeconds,
                    "videoUrl": info.videoDetails.video_url,
                    "publishDate": info.videoDetails.publishDate,
                    "viewCount": info.videoDetails.viewCount
                }
            }
            const media = await MessageMedia.fromUrl(data.video.thumbnail, { unsafeMime: true });
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerName: data.channel.user });
            ytdl(url, { filter: 'audioonly', format: 'mp3', quality: 'highest' }).pipe(fs.createWriteStream(`./commands/audio_dl/download.mp3`)).on('finish', async () => {
                const media = await MessageMedia.fromFilePath(`./commands/audio_dl/download.mp3`);
                media.filename = `${data.video.title}.mp3`;
                await processing.delete(true);
                const caption = `• Title : *${data.video.title}*\n• Channel : *${data.channel.name}*\n• View Count : *${data.video.viewCount}*`
                await client.sendMessage(message.from, media, { caption: caption, sendMediaAsDocument: true });
                await processAudio(client, message, './commands/audio_dl/download.mp3');
            });
        }
    } catch (error) {
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

async function VideoDownloadYouTube(client, message, prefix) {
    let url = message.body.split(prefix + "video")[1].trim();

    try {
        if (!url.trim()) {
            await message.reply('No query!');
            return;
        }
        else {
            const processing = await message.reply('```Please be patient while the video is downloading...```');
            if (url.startsWith('https://')) {
                url = url;
            } else {
                const response = await axios(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&key=AIzaSyCqcwglCnBbIBhkZ5o8Poek_Jxzd3tknK8&q=${url.trim()}`);
                const data = response.data.items[0].id.videoId;
                url = `https://www.youtube.com/watch?v=${data}`;
            }
            let info = await ytdl.getInfo(url);
            const formats = info.formats.map((format) => {
                return {
                    url: format.url,
                    hasVideo: format.hasVideo,
                    hasAudio: format.hasAudio,
                };
            });

            const videoAudioFormats = formats.filter((format) => format.hasVideo && format.hasAudio);

            const title = info.videoDetails.title;
            const channelName = info.player_response.videoDetails.author;
            const viewCount = info.player_response.videoDetails.viewCount;
            const sizeInBytes = info.formats[0].contentLength;
            let sizeInMB = (sizeInBytes / (1024*1024)).toFixed(2);
            const durationInSeconds = info.player_response.videoDetails.lengthSeconds;
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = durationInSeconds % 60;
            const duration = `${minutes}m${seconds}s`;

            const downloadLink = videoAudioFormats[0].url;

            const media = await MessageMedia.fromUrl(downloadLink, { unsafeMime: true });
            media.filename = `${title}.mp4`;
            await processing.edit('```Upoading...```');
            const caption = `• Title : *${title}*\n• Channel : *${channelName}*\n• View Count : *${viewCount}*\n• Size : *${sizeInMB} MB*\n• Duration : *${duration}*`
            await client.sendMessage(message.from, media, { caption: caption });
            await processing.delete(true);
        }
    } catch (error) {
        console.log(error);
        message.reply('Something went wrong.');
    }
}

async function GetYouTubeInfo(client, message, prefix) {
    let url = message.body.split(prefix + "detail")[1].trim();
    try {
        if (!url.trim()) {
            await message.reply('No query!')
            return;
        }
        else {
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
    } catch (error) {
        console.log(error);
        message.reply('Something went wrong.');
    }

}


// Export all the functions in an object
module.exports = {
    AudioDownloadYouTube,
    GetYouTubeInfo,
    VideoDownloadYouTube
};

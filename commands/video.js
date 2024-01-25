const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');

module.exports = async function videoCommand(client, message, prefix) {
    try {
        let utext = message.body.split(prefix + "video")[1].trim();
        if (!utext.trim()) {
            message.reply("No query!");
            return;
        } else {
            if(utext.startsWith('https://')){
                utext = utext;
            }else{
                const response = await axios(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&key=AIzaSyCqcwglCnBbIBhkZ5o8Poek_Jxzd3tknK8&q=${utext.trim()}`);
                const data = response.data.items[0].id.videoId;
                utext = `https://www.youtube.com/watch?v=${data}`;
            }   
            const downloading = await message.reply('```Please be patient while the video is downloading...```');
            const response = await fetch(`https://vihangayt.me/download/ytmp4?url=${utext.trim()}`);
            const data = await response.json();
            const video = data.data.vid_720p;

            // Set unsafeMime option to true to bypass MIME type detection
            const media = await MessageMedia.fromUrl(video, { unsafeMime: true });

            var title = data.data.title;
            var size = media.filesize;
            var duration = data.data.duration;
            downloading.edit('```Uploading...```')
            function formatFileSize(fileSizeInBytes) {
                if (fileSizeInBytes < 1024) {
                    return fileSizeInBytes + ' B';
                } else if (fileSizeInBytes < 1024 * 1024) {
                    return (fileSizeInBytes / 1024).toFixed(2) + ' KB';
                } else if (fileSizeInBytes < 1024 * 1024 * 1024) {
                    return (fileSizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
                } else {
                    return (fileSizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
                }
            }
            const readableFileSize = formatFileSize(size);
            const caption = `*Title:* ${title}\n*Size:* ${readableFileSize}\n*Duration:* ${duration}`;
            await client.sendMessage(message.from, media, { caption: caption });
            await downloading.delete(true);
        }
    } catch (error) {
        message.reply("Error"+`\n\n${error.message}`);
        // console.log(error);
    }
}

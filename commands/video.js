const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function videoCommand(client, message) {
    try {
        if (message.body.trim() == '.video') {
            message.reply("No query!");
        } else {
            const downloading = message.reply('```Please be patient while the video is downloading...```');
            const utext = message.body.replace('.video ', '');
            const response = await fetch(`https://vihangayt.me/download/ytmp4?url=${utext}`);
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
        message.reply("Error");
        console.log(error);
    }
}

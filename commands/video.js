const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async function videoCommand(client, message) {
    try {
        if (message.body.trim() == '.video') {
            message.reply("No query!");
        } else {
            message.reply('```Please be patient while the video is downloading...```');
            const utext = message.body.replace('.video ', '');
            const response = await fetch(`https://api.akuari.my.id/downloader/yt1?link=${utext}`);
            const data = await response.json();
            const video = data.urldl_video;
            const FinalLink = video.link;

            // Set unsafeMime option to true to bypass MIME type detection
            const media = await MessageMedia.fromUrl(FinalLink, { unsafeMime: true });

            var title = data.info.title;
            var size = media.filesize;
            var channel = data.info.channel;
            message.reply('```Uploading...```')
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
            const caption = `*Title:* ${title}\n*Size:* ${readableFileSize}\n*Channel:* ${channel}`;
            await client.sendMessage(message.from, media, { caption: caption });
        }
    } catch (error) {
        message.reply("Error");
        console.log(error);
    }
}

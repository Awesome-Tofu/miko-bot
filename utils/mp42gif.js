const ffmpeg = require('fluent-ffmpeg');
const download = require('download');
const fs = require('fs');

async function mp42gifFile(inputPath, outputFilePath) {
  let downloadedFilePath = inputPath;

  // If the input is a URL, download the video
  if (inputPath.startsWith('http')) {
    const buffer = await download(inputPath);
    downloadedFilePath = './webps/input.mp4';
    fs.writeFileSync(downloadedFilePath, buffer);
    console.log('Download complete');
  }

  return new Promise((resolve, reject) => {
    ffmpeg(downloadedFilePath)
      .inputFormat('mp4')
      .outputFormat('gif')
      .on('end', () => {
        console.log('Conversion finished');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      })
      .save(outputFilePath);
  });
}


module.exports = mp42gifFile;



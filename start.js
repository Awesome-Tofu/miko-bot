const fs = require('fs');
const { downloadFiles, folderExistsOnGithub, uploadFiles } = require('./session/session.js');
const generateQrCode = require('./genQr.js');

const localPath = '.wwebjs_auth';

if (fs.existsSync(localPath)) {
    console.log('please wait, uploading your session folder to github...');
    uploadFiles(localPath);
    require('./index.js');
  } else {
    console.log('please wait, checking if your session folder exists on GitHub...');
    folderExistsOnGithub(localPath).then(async (existsOnGithub) => {
      if (existsOnGithub) {
          console.log('please wait, downloading your session folder...');
          await downloadFiles(localPath, localPath); 
          console.log('sess1');
          generateQrCode().then(() => {
            console.log('sess2');
            require('./index.js');
        });
      } else {
          console.log('no session is present, generating qr code..');
          console.log('sess1');
          generateQrCode().then(() => {
            console.log('sess2');
            require('./index.js');
        });
      }
  });
  }
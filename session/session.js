const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { Octokit } = require("@octokit/rest");
require('dotenv').config();
const axios = require('axios');

const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({
  auth: token,
});

const parsedUrl = new URL(process.env.SESSION_REPO);
const pathParts = parsedUrl.pathname.split("/");
const username = pathParts[1];
const repository = pathParts[2];

// async function clean() {
//     const dirPath = path.join(__dirname, './.wwebjs_auth');
//     try {
//         await fsPromises.access(dirPath);
//         await fsPromises.rm(dirPath, { recursive: true });
//         console.log("Session directory cleaned");
//     } catch (error) {
//         if (error.code === 'ENOENT') {
//             // Directory does not exist, do nothing
//         } else {
//             console.error(`Error while cleaning session directory: ${error}`);
//         }
//     }
// }

// let totalFiles = 0;
// let uploadedFiles = 0;

// const countFiles = (folderPath) => {
//   const files = fs.readdirSync(path.join(__dirname, folderPath));

//   for (const file of files) {
//     const filePath = path.join(folderPath, file);

//     if (fs.lstatSync(filePath).isDirectory()) {
//       countFiles(filePath); // Recursively count files in subdirectory
//     } else {
//       totalFiles++;
//     }
//   }
// };

const uploadFiles = async (folderPath) => {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      await uploadFiles(filePath); // Recursively upload files in subdirectory
    } else {
      const fileData = fs.readFileSync(filePath);

      await octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: repository,
        path: filePath.replace(/\\/g, '/'), // Replace backslashes with forward slashes for GitHub
        message: `Adding ${file}`,
        content: Buffer.from(fileData).toString('base64'),
      }).catch((error) => {
        console.error(`Error creating or uploading file ${file}:`, error);
      });
    }
  }
};


const downloadFiles = async (repoPath, localPath) => {
    const { data } = await octokit.repos.getContent({
      owner: username,
      repo: repository,
      path: repoPath,
    });
  
    if (Array.isArray(data)) { // If it's a directory
      fs.mkdirSync(localPath, { recursive: true });
  
      for (const file of data) {
        await downloadFiles(file.path, path.join(localPath, file.name));
      }
    } else { // If it's a file
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      fs.writeFileSync(localPath, content);
    }
  };

  
async function folderExistsOnGithub(path) {
    try {
        const url = `https://api.github.com/repos/${username}/${repository}/contents/${path}`;
        const headers = { 'Authorization': `token ${token}` };
        const response = await axios.get(url, { headers });
        return Array.isArray(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return false;
        } else {
            throw error;
        }
    }
}

// countFiles('../.wwebjs_auth');

module.exports = { uploadFiles, downloadFiles, folderExistsOnGithub };

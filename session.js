const fs = require('fs').promises;
const { Octokit } = require('@octokit/rest');
const unzipper = require('unzipper');
const archiver = require('archiver');
const path = require('path');
const dotenv = require('dotenv');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

dotenv.config();

const repo_link = process.env.SESSION_REPO;
const parsedUrl = new URL(repo_link);
const pathParts = parsedUrl.pathname.split("/");
const username = pathParts[1];
const repository = pathParts[2];

const token = process.env.GITHUB_TOKEN;

const octokit = new Octokit({ auth: token });

async function checkAndPerformOperation() {
  const authFolderName = '.wwebjs_auth';

  const authFolderExists = await folderExists(authFolderName);

  if (authFolderExists) {
    try {
      await uploadFolderToGitHub(authFolderName);
    } catch (error) {
      await deleteZipFileFromGitHub();
    }
  } else if (!authFolderExists){
    await downloadAndExtractFolderFromGitHub();
    // await deleteZipFileFromGitHub();
  }else{
    console.log("AH shit vro");
  }
}

async function uploadFolderToGitHub(folderName) {
  console.log(`Uploading ${folderName} session...`);

  const folderPath = path.join(__dirname, folderName);

  // Create a zip archive of the folder
  const zipFileName = `${folderName}.zip`;
  const zipFilePath = path.join(__dirname, zipFileName);
  await zipFolder(folderPath, zipFilePath);

  // Log the number of files in the zip file
  // const zipFileContents = await getZipFileContents(zipFilePath);
  // console.log(`Number of files in ${zipFileName}: ${zipFileContents.length}`);

  // Read the contents of the zip file
  const zipFileData = await fs.readFile(zipFilePath);

  // Upload the zip file to GitHub
  await octokit.repos.createOrUpdateFileContents({
    owner: username,
    repo: repository,
    path: zipFileName,
    message: `Upload ${zipFileName} in ${folderName} session`,
    content: zipFileData.toString('base64'),
    committer: {
      name: 'Itachi',
      email: 'jmchauhan121005@gmail.com',
    },
    author: {
      name: 'Itachi',
      email: 'jmchauhan121005@gmail.com',
    },
  });

  // Remove the local zip file
  await fs.unlink(zipFilePath);

  console.log(`${folderName} session uploaded.`);
}

async function zipFolder(sourceFolder, targetFile) {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const output = fs.createWriteStream(targetFile);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceFolder, false);
    archive.finalize();
  });
}


// Delete zip file from Github
async function deleteZipFileFromGitHub() {
  console.log('Deleting .wwebjs_auth.zip from GitHub...');

  const filePath = '.wwebjs_auth.zip';

  try {
    const { data: file } = await octokit.repos.getContent({
      owner: username,
      repo: repository,
      path: filePath,
    });

    const response = await octokit.repos.deleteFile({
      owner: username,
      repo: repository,
      path: filePath,
      message: `Delete ${filePath}`,
      sha: file.sha,
    });

    console.log(`File ${filePath} deleted from GitHub. Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('err while deleting session on github');
    // throw error;
  }
}



async function downloadAndExtractFolderFromGitHub() {
  console.log(`Downloading and extracting .wwebjs_auth session...`);

  const targetPath = __dirname;

  // Download the zip file from GitHub
  const zipFileUrl = `https://github.com/${username}/${repository}/raw/main/.wwebjs_auth.zip`;
  const response = await fetch(zipFileUrl);

  if (!response.ok) {
    throw new Error(`Failed to download .wwebjs_auth session. Status: ${response.status} ${response.statusText}`);
  }

  // Save the zip file
  const zipFilePath = path.join(targetPath, '.wwebjs_auth.zip');
  const zipFileData = await response.arrayBuffer();
  await fs.writeFile(zipFilePath, Buffer.from(zipFileData));

  // Extract the contents of the zip file
  await extractZipFile(zipFilePath, targetPath);

  // Remove the local zip file
  await fs.unlink(zipFilePath);

  console.log(`.wwebjs_auth session downloaded and extracted.`);
}

async function extractZipFile(zipFilePath, targetPath) {
  console.log(`Extracting files from .wwebjs_auth session...`);

  // Use the code from your existing unzip.js script
  await unzipFile(zipFilePath, targetPath);
}

async function unzipFile(zipFilePath, targetPath) {
  return new Promise((resolve, reject) => {
    const readStream = require('fs').createReadStream(zipFilePath); // Ensure 'require' is used

    const extractStream = unzipper.Extract({ path: targetPath+'/.wwebjs_auth' });

    readStream.pipe(extractStream);

    extractStream.on('finish', () => {
      console.log('Extraction completed!');
      resolve();
    });

    extractStream.on('error', (err) => {
      console.error('Error during extraction:', err);
      reject(err);
    });
  });
}


async function folderExists(folderPath) {
  try {
    const stats = await fs.stat(folderPath);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false; // Folder does not exist
    }
    throw error;
  }
}

// Call the function to check and perform the operation
// checkAndPerformOperation();

module.exports = {
  downloadAndExtractFolderFromGitHub,
  deleteZipFileFromGitHub,
  uploadFolderToGitHub
}

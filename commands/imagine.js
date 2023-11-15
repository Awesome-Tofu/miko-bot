// imagine.js
const { MessageMedia } = require('whatsapp-web.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


// Function to extract query and negative prompt from user input
function extractQueryAndNegativePrompt(input) {
    const regex = /"([^"]+)"\s+"([^"]+)"/;
    const match = input.match(regex);
    if (match) {
        const [, query, negativePrompt] = match;
        return { query, negativePrompt };
    }
    return null;
}

module.exports = async function imagineCommand(client, message) {
    // Extract the user's input
    const userInput = message.body.replace('.imagine', '').trim();

    // Parse the user's input to extract query and negative prompt
    const queryAndNegativePrompt = extractQueryAndNegativePrompt(userInput);

    if (queryAndNegativePrompt && queryAndNegativePrompt.query) {
        console.log('Query:', queryAndNegativePrompt.query);
        console.log('Negative Prompt:', queryAndNegativePrompt.negativePrompt);

        // Send a notification to the user to wait patiently
        message.reply('Please wait patiently while the image is being generated. Do not spam the command.');

        // Construct the URL for fetching the image with the query and negative prompt
        const apiUrl = `https://tofuapi.onrender.com/imagine/8/${queryAndNegativePrompt.query}/${queryAndNegativePrompt.negativePrompt}`;

        try {
            // Fetch the image from the API
            const response = await fetch(apiUrl);

            if (response.ok) {
                const imageJson = await response.json();

                if (imageJson.image) {
                    // Create a MessageMedia object with the fetched image
                    const media = await MessageMedia.fromUrl(imageJson.image);
                    const capDetect = `*Prompt:* ${queryAndNegativePrompt.query}\n\n*Negative Prompt:* ${queryAndNegativePrompt.negativePrompt}`
                    // Send the image to the user
                    client.sendMessage(message.from, media, {caption:capDetect});
                } else {
                    // Handle the case where the API response does not contain an image URL
                    client.sendMessage(message.from, 'Sorry, I couldn\'t find an image for that query and negative prompt.');
                }
            } else {
                // Handle the case where the API request was not successful
                client.sendMessage(message.from, 'Sorry, there was an issue fetching the image. Please try again later.');
            }
        } catch (error) {
            // Handle any errors that occur during the fetch operation
            console.error('Error while fetching image:', error);

            // Check if the error is related to Puppeteer closure
            if (error.message.includes('Session closed') || error.message.includes('page has been closed')) {
                client.sendMessage(message.from, 'There was an issue with the image generation process. Please try again later.');
                console.error(error);
            } else {
                client.sendMessage(message.from, 'An error occurred while fetching the image. Please try again later.');
            }
        }
    } else {
        // Handle the case where the user didn't provide a valid query and negative prompt
        message.reply('Please provide a query and a negative prompt in double quotes (e.g., ```.imagine "1girl, pink hair, office bakcground, arms behind back" "nsfw, bad hand, bad art```).\nHwere first double quote is prompt and second is negative prompt.');
    }
};

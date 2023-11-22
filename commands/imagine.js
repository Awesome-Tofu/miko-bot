// imagine.js
const { MessageMedia } = require('whatsapp-web.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Define a mapping of imagine commands to model numbers and names
const modelMapping = {
    imagine1: { number: '8', name: 'MeinaHentai' },
    imagine2: { number: '2', name: 'MeinaMix' },
    imagine3: { number: '3', name: 'AnyLora' },
    imagine4: { number: '4', name: 'AnyThingV4' },
    imagine5: { number: '7', name: 'DarkSushi' },
};

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
    try{
        const userInput = message.body.replace('.imagine', '').trim();

        // Use a regular expression to split the input into command and parameters
        const match = userInput.match(/^(\S+)(?:\s+(.+))?/);

        if (match) {
            // Extract the command and parameters
            const command = match[1];
            const parameters = match[2] || ''; // Use an empty string if parameters are not provided

            console.log('Command:', command);
            // Determine the model number and name based on the command
            const { number, name } = modelMapping['imagine' + command];
            console.log('Model Number:', number);
            console.log('Model Name:', name);

            if (number) {
                // Parse the user's input to extract query and negative prompt
                const queryAndNegativePrompt = extractQueryAndNegativePrompt(parameters);

                if (queryAndNegativePrompt && queryAndNegativePrompt.query) {
                    console.log('Query:', queryAndNegativePrompt.query);
                    console.log('Negative Prompt:', queryAndNegativePrompt.negativePrompt);

                    // Send a notification to the user to wait patiently
                    message.reply('Please wait patiently while the image is being generated. Do not spam the command.');

                    // Construct the URL for fetching the image with the query and negative prompt
                    const apiUrl = `https://tofuapi.onrender.com/imagine/${number}/${queryAndNegativePrompt.query}/${queryAndNegativePrompt.negativePrompt}`;

                    try {
                        // Fetch the image from the API
                        const response = await fetch(apiUrl);

                        if (response.ok) {
                            const imageJson = await response.json();

                            if (imageJson.image) {
                                // Create a MessageMedia object with the fetched image
                                const media = await MessageMedia.fromUrl(imageJson.image);
                                const caption = `*Prompt:* ${queryAndNegativePrompt.query}\n\n*Negative Prompt:* ${queryAndNegativePrompt.negativePrompt}\n*Model:* ${name}`;
                                // Send the image to the user
                                client.sendMessage(message.from, media, { caption: caption });
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
                    client.sendMessage(message.from, 'Please provide a query and a negative prompt in double quotes (e.g., `.imagine1 "1girl, pink hair, office background, arms behind back" "nsfw, bad hand, bad art"`). First double quote is the prompt, and the second is the negative prompt.');
                }
            } else {
                // Handle the case where the user used an invalid imagine command
                client.sendMessage(message.from, 'Invalid imagine command. Please use one of the following commands:\n' +
                    'imagine1, imagine2, imagine3, imagine4, imagine5');
            }
        } else {
            // Handle the case where the user didn't provide a valid command and parameters
            client.sendMessage(message.from, 'Invalid format. Please use the format `.imagineN "query" "negative prompt"`.\n\nAvalible commmands and model\n*imagine1:* Model *MeinaHentai*\n*imagine2:* Model *MeinaMix*\n*imagine3:* Model *AnyLora*\n*imagine4:* Model *AnyThingV4*\n*imagine5:* Model *DarkSushi*\n\n*Example*\n.imagine1 "1girl, pink hair, office background, arms behind" "nsfw, bad hand, no men, no dust"');
        }
    }catch(error){
        message.reply("error");
        console.error(error);
    }
    
};

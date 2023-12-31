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
    imagine6: { number: '9', name: 'DarkSushi Mix' },
    imagine7: { number: '10', name: 'SDXL' },
    imagine8: { number: '11', name: 'Creative' },
    imagine9: { number: '12', name: 'CreativeV2' },
    imagine10: { number: '13', name: 'Absolute Reality' },
    imagine11: { number: '17', name: 'CalicoMix' },
    imagine12: { number: '15', name: 'Concept Art' },
    imagine13: { number: '16', name: 'Lexica' },

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

module.exports = async function imagineCommand(client, message, prefix) {
    const invalid_cmd_msg = 'Invalid format. Please use the format `' +prefix+ 'imagineN "query" "negative prompt"`.\n\nAvalible commmands and model\n*imagine1:* Model *MeinaHentai*\n*imagine2:* Model *MeinaMix*\n*imagine3:* Model *AnyLora*\n*imagine4:* Model *AnyThingV4*\n*imagine5:* Model *DarkSushi*\n*imagine6:* Model *DarkSushi Mix*\n*imagine7:* Model *SDXL*\n*imagine8:* Model *Creative*\n*imagine9:* Model *CreativeV2*\n*imagine10:* Model *Absolute Reality*\n*imagine11:* Model *CalicoMix*\n*imagine12:* Model *Concept Art*\n*imagine13:* Model *Lexica* \n\n*Example*\n'+prefix+'imagine1 "1girl, pink hair, office background, arms behind" "nsfw, bad hand, no men, no dust"';
    // Extract the user's input
    if (message.body.startsWith(prefix + 'imagine ')) {
        await message.reply(invalid_cmd_msg);
        return;
    }

    const waiit = await message.reply('Please wait patiently while the image is being generated. Do not spam the command.');

    
    try{
        const userInput = message.body.split(prefix + "imagine")[1].trim();

        // Use a regular expression to split the input into command and parameters
        const match = userInput.match(/^(\S+)(?:\s+(.+))?/);

        if (match) {
            // Extract the command and parameters
            const command = match[1];
            const parameters = match[2] || '';

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


                    // Construct the URL for fetching the image with the query and negative prompt
                    const apiUrl = `https://tofuapi.onrender.com/imagine/${number}/${queryAndNegativePrompt.query}/${queryAndNegativePrompt.negativePrompt}`;

                    try {
                        // Fetch the image from the API
                        const response = await fetch(apiUrl);

                        if (response.ok) {
                            const imageJson = await response.json();
                            if (imageJson.img_urls[0]) {
                                // Create a MessageMedia object with the fetched image
                                const media = await MessageMedia.fromUrl(imageJson.img_urls[0], { unsafeMime: true });
                                const caption = `*Prompt:* ${queryAndNegativePrompt.query}\n\n*Negative Prompt:* ${queryAndNegativePrompt.negativePrompt}\n*Model:* ${name}`;
                                // Send the image to the user
                                client.sendMessage(message.from, media, { caption: caption });
                            } else {
                                // Handle the case where the API response does not contain an image URL
                                waiit.edit('Sorry, I couldn\'t find an image for that query and negative prompt.');
                            }
                        } else {
                            // Handle the case where the API request was not successful
                            waiit.edit('Sorry, there was an issue fetching the image. Please try again later.');
                        }
                    } catch (error) {
                        // Handle any errors that occur during the fetch operation
                        console.error('Error while fetching image:', error);

                        // Check if the error is related to Puppeteer closure
                        if (error.message.includes('Session closed') || error.message.includes('page has been closed')) {
                            waiit.edit('There was an issue with the image generation process. Please try again later.');
                            console.error(error);
                        } else {
                            waiit.edit('An error occurred while fetching the image. Please try again later.');
                        }
                    }
                } else {
                    // Handle the case where the user didn't provide a valid query and negative prompt
                    client.sendMessage(message.from, 'Please provide a query and a negative prompt in double quotes (e.g., `'+prefix+'imagine1 "1girl, pink hair, office background, arms behind back" "nsfw, bad hand, bad art"`). First double quote is the prompt, and the second is the negative prompt.');
                }
            } else {
                // Handle the case where the user used an invalid imagine command
                client.sendMessage(message.from, 'Invalid imagine command. Please use one of the following commands:\n' +
                    'imagine1, imagine2, imagine3,...imagine13');
            }
        } else {
            // Handle the case where the user didn't provide a valid command and parameters
            client.sendMessage(message.from, invalid_cmd_msg);
        }
    }catch(error){
        waiit.edit("Error"+`\n${error.message}`);
    }
    
};

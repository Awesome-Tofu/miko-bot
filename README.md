# MIKO BOT

MIKO BOT is a Node.js-based WhatsApp chatbot powered by [Puppeteer](https://pptr.dev/) and [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). It allows you to automate interactions with WhatsApp Web, enabling various automated tasks and responses.

## Features

- **WhatsApp Automation**: MIKO BOT can automate tasks such as sending messages, images, and stickers to WhatsApp contacts or groups.
- **Dynamic Responses**: Customize your bot to provide dynamic responses based on user inputs or predefined conditions.
- **Message Handling**: Handle incoming messages, process them, and respond accordingly.
- **Sticker Handling**: Respond with random stickers from a predefined collection.

## Getting Started

Follow these steps to set up and run the MIKO BOT on your local machine or deploy it to a cloud platform like Heroku.

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/awesome-tofu/miko-bot.git

2. **Install  Dependencies:**

    ```bash
    npm install

3. **Set Environment Variables:**

    ```env
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD (required) if you are running on windows, remove it
   PUPPETEER_EXECUTABLE_PATH (required) if you are running on windows, remove it
   MONGODB_URI (optional)
   DEFAULT_LANGUAGE (optional)
   BOT_NUMBER (required)
   OWNER_NUMBER (required)
   NUMVERIFY_KEY (required)
   DEPLOY_HOOK (Optional) only add if you in render, it will be in settings of project

4. **Start the script:**
   ```bash
   npm start

5. **Scanning the QR code:**

   Open the link provided by the deployment platform OR if you are running on local platform open http://localhost:3000/ or http://localhost:PORT/

5. **Command Usage:**
Once the bot is running, you can start sending commands and messages to it via WhatsApp.

   | Command          | Description                                  |
   | ----------------- | -------------------------------------------- |
   | `.start`         | Command to start the bot.                    |
   | `.send <message>`| Send a text message to a contact or group.   |
   | `.imageine`         | Generate a random image from a predefined list.  |
   | `.sticker`       | Send a sticker from replied image.     |
   | `.translate <text>` | Translate text to the default language.    |
   | `.report <issue>`| Report an issue with the bot.              |
   | `.support`       | Get support and assistance.                |
   | `.help`       | You can see more command lists               |
   

## License

[MIT](https://choosealicense.com/licenses/mit/)


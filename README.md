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
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
    PUPPETEER_EXECUTABLE_PATH = /usr/bin/google-chrome-stable
    MONGODB_URI = your MONGODB_URI
    DEFAULT_LANGUAGE = default language to be translated to in .tr command
    BOT_NUMBER = 918051xxxxxx
    OWNER_NUMBER = 917437xxxxxx
    NUMVERIFY_KEY = 13e4e196a58f64646251999692b9d006

4. **Usage:**
Once the bot is running, you can start sending commands and messages to it via WhatsApp.

| Command          | Description                                  |
| ----------------- | -------------------------------------------- |
| `.start`         | Command to start the bot.                    |
| `.help`          | See the list of available commands.         |
| `.send <message>`| Send a text message to a contact or group.   |
| `.imageine`         | Generate a random image from a predefined list.  |
| `.sticker`       | Send a sticker from replied image.     |
| `.translate <text>` | Translate text to the default language.    |
| `.report <issue>`| Report an issue with the bot.              |
| `.support`       | Get support and assistance.                |

## License

[MIT](https://choosealicense.com/licenses/mit/)


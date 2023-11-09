const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');


module.exports = async function testCommand(client, message) {
    const quotedMsg = await message.getQuotedMessage();
    if (quotedMsg) {
        const user_pp = await client.getProfilePicUrl(quotedMsg.author || quotedMsg.from) || "https://te.legra.ph/file/7ea1d50fdd0b2e7c447cc.png";
        const contact = await quotedMsg.getContact();
        const user_name = contact.pushname;
        const repliedText = quotedMsg.body;
        try{
            const imagesFolderPath = path.join(__dirname, 'images');
            if (!fs.existsSync(imagesFolderPath)) {
                fs.mkdirSync(imagesFolderPath);
              }

              let bgcolor = ["#FFFFFF", "#000000"];
              let randombgcolor = bgcolor[Math.floor(Math.random() * bgcolor.length)];

              const response = await fetch("https://bot.lyo.su/quote/generate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: "quote",
                  format: "png",
                  backgroundColor: randombgcolor,
                  width: 512,
                  height: 512,
                  scale: 3,
                  messages: [
                    {
                      avatar: true,
                      from: {
                        first_name: user_name,
                        language_code: "en",
                        name: user_name,
                        photo: {
                          url: user_pp,
                        },
                      },
                      text: repliedText,
                      replyMessage: {},
                    },
                  ],
                })
              });
              const data = await response.json();
              let img = Buffer.alloc(data.result.image.length, data.result.image, "base64");
            //   console.log(img);

              const imagePath = path.join(imagesFolderPath, 'quote.png');
              fs.writeFileSync(imagePath, img);

              const media = await MessageMedia.fromFilePath(imagePath);
              await client.sendMessage(message.from, media, { sendMediaAsSticker: true });


        }catch(error){
            console.error("Error:", error);
             message.reply("Error!")
        }

    }else{
        message.reply("Please reply to the user and use the .q command");
    }
}

const wiki = require('wikipedia');
const { MessageMedia } = require('whatsapp-web.js');

const wikip = async (query) => {
    try {
		const page = await wiki.page(query);
		// console.log(page);
		//Response of type @Page object
		const summary = await page.summary();
        const title = summary.title;
        let thumbnail;
        try {
            thumbnail = summary.thumbnail.source ;
        } catch (error) {
            thumbnail = 'https://graph.org/file/725f83be09877c2b9913e.png'
        }
        const description = summary.description;
        const extract = summary.extract;
        const wikilink = summary.content_urls.mobile.page;

        const wikiObj = {
            title,
            thumbnail,
            description,
            extract,
            wikilink
        }

		return wikiObj
		//Response of type @wikiSummary - contains the intro and the main image
	} catch (error) {
		console.log(error);
        const newErrorMessage = error.message;
        const newError = new Error(newErrorMessage);
        throw newError; 
	}
    }


module.exports = async function wikiCommand(client, message) {
    try {
        const utext = message.body.replace('.wiki', '').trim();
        const wikiResult = await wikip(utext);
        const media = await MessageMedia.fromUrl(`${wikiResult.thumbnail}`, {unsafeMime: true});
        const caption = `*Title:* ${wikiResult.title}\n\n*Description:* ${wikiResult.description}\n\n*Result:* ${wikiResult.extract}\n\n*Link:* ${wikiResult.wikilink}`
        await client.sendMessage(message.from, media, {caption: caption});
        
    } catch (error) {
        message.reply("Something went wrong\n\n"+`${error.message}`);
        // console.log(error);
    }
}

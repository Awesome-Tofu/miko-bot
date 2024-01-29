const instagramDl = require("@sasmeee/igdl");

module.exports.igdl = async function(url) {
    try {
        const dataList = await instagramDl(url);
        const linksArray = dataList.map(item => item.download_link);
    
        const output = {
          made_by: "@awesome-tofu",
          data: linksArray
        };
    
        return output;
      } catch (error) {
        if (error instanceof TypeError) {
          return 'Invalid URL';
        }
        throw error;
      }
}
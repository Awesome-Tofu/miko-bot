const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const importedTags = require('./tags');


//Get list of tags
async function tags() {
    try {
        return importedTags;
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return "Error while getting tags!";
    }
}


//Get random trending videos
async function trending() {
    try {
        const response = await fetch('https://hanime.cyclic.app/trending/day/1');
        const data = await response.json();

        if (!data.results) {
            console.error('Results not found in the response');
            return '';
        }
        
        const trends =  data.results.map(item => '➤ '+item.slug);
        const formattedTrends = trends.join('\n');

        return formattedTrends;
    } catch (error) {
        console.error(error);
        return "Error while getting trending";
    }
}



//Get slug from tag
async function getSlug(tag, page){
    try{
        const response = await fetch(`https://hanime.cyclic.app/hentai-tags/${tag}/${page}`);
        const data = await response.json();

        if (!data.results) {
            console.error('Results not found in the response');
            return;
        }

        const slugs =  data.results.map(item => '➤ '+item.slug);
        const formattedSlugs = slugs.join('\n');

        return formattedSlugs;
    }catch(error){
        console.error(error);
        return "Error while getting tag\n*Example usage*\n.hanime get facial 0\n.hanime get <tag> <page>"
    }
}

//Get video from slug
async function watch(slug){
    try{
        const response = await fetch(`https://hanime.cyclic.app/watch/${slug}`);
        const data = await response.json();
        const videoData = data.results[0].streams;
        const video360p = videoData.find(video => video.height === "360");
        const video480p = videoData.find(video => video.height === "480");
        const video720p = videoData.find(video => video.height === "720");

        const vidQualities = {
            360: video360p.url,
            480: video480p.url,
            720: video720p.url,
        }

        return vidQualities;
    }catch(error){
        console.error(error);
        return "There was an error while getting Watch"
    }
}

async function hinfo(slug){
    try{
        const response = await fetch(`https://hanime.cyclic.app/watch/${slug}`);
        const data = await response.json();
        const resultsData = data.results[0];
        const infoData = {
            img: resultsData.poster_url,
            name: resultsData.name,
            id: resultsData.id,
            desc: resultsData.description,
            views: resultsData.views,
        }
        return infoData;
    }catch(error){
        console.error(error);
        return "There was an error while getting hentai info"
    }
}


module.exports = {
    tags,
    trending,
    getSlug,
    watch,
    hinfo
  };
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
        const response = await fetch('https://alive-miniskirt-seal.cyclic.app/trending/day/1');
        const data = await response.json();

        if (!data.results) {
            console.error('Results not found in the response');
            return '';
        }
        
        const trends =  data.results.map(item => item.slug);
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
        const response = await fetch(`https://alive-miniskirt-seal.cyclic.app/hentai-tags/${tag}/${page}`);
        const data = await response.json();

        if (!data.results) {
            console.error('Results not found in the response');
            return;
        }

        const slugs =  data.results.map(item => item.slug);
        const formattedSlugs = slugs.join('\n');

        return formattedSlugs;
    }catch(error){
        console.error(error);
        return "Error while getting getSlug"
    }
}

//Get video from slug
async function watch(slug){
    try{
        const response = await fetch(`https://alive-miniskirt-seal.cyclic.app/watch/${slug}`);
        const data = await response.json();
        const videoData = data.results[0].streams;
        const video360p = videoData.find(video => video.height === "360");

        if (video360p) {
            return video360p.url;
        } else {
            return "No video with 360p height found";
        }
    }catch(error){
        console.error(error);
        return "There was an error while getting Watch"
    }
}

async function hinfo(slug){
    try{
        const response = await fetch(`https://alive-miniskirt-seal.cyclic.app/watch/${slug}`);
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
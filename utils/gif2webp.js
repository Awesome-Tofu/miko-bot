const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

function gif2webp(url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      responseType: 'stream', // Set responseType to 'stream' to download the file
    })
      .then((response) => {
        const form = new FormData();
        form.append('new-image-url', '');
        form.append('new-image', response.data);

        axios({
          method: 'post',
          url: 'https://s6.ezgif.com/gif-to-webp',
          data: form,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
          },
        })
          .then(({ data }) => {
            const bodyFormThen = new FormData();
            const $ = cheerio.load(data);
            const file = $('input[name="file"]').attr('value');
            bodyFormThen.append('file', file);
            bodyFormThen.append('convert', 'Convert GIF to WEBP!');

            axios({
              method: 'post',
              url: 'https://ezgif.com/gif-to-webp/' + file,
              data: bodyFormThen,
              headers: {
                'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`,
              },
            })
              .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = 'https:' + $('div#output > p.outfile > img').attr('src');
                resolve({
                  status: true,
                  message: 'Created By github.com/awesome-tofu',
                  result: result,
                });
              })
              .catch(reject);
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

module.exports = gif2webp;

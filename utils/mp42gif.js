const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

function mp42gifFile(url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    })
      .then((response) => {
        const form = new FormData();
        form.append('new-image-url', '');
        form.append('new-image', response.data);

        axios({
          method: 'post',
          url: 'https://s6.ezgif.com/video-to-gif',
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
            bodyFormThen.append('convert', 'Convert MP4 to GIF!');

            axios({
              method: 'post',
              url: 'https://ezgif.com/video-to-gif/' + file,
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

module.exports = mp42gifFile;
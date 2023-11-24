const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

function gif2mp4File(url) {
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
          url: 'https://s6.ezgif.com/gif-to-mp4',
          data: form,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
          },
        })
          .then(({ data }) => {
            console.log(data);
            const bodyFormThen = new FormData();
            const $ = cheerio.load(data);
            const file = $('input[name="file"]').attr('value');
            bodyFormThen.append('file', file);
            bodyFormThen.append('convert', 'Convert GIF to MP4!');

            axios({
              method: 'post',
              url: 'https://ezgif.com/gif-to-mp4/' + file,
              data: bodyFormThen,
              headers: {
                'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`,
              },
            })
              .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = 'https:' + $('div#output > p.outfile > video > source').attr('src');
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

module.exports = gif2mp4File;
const axios = require('axios');
const request = require('request');
const fs = require('fs');

module.exports.config = {
  name: 'lyrics',
  version: '1',
};

module.exports.run = async ({ api, event, args }) => {
  const song = args.join(' ');

  if (!song) {
    return api.sendMessage('Please enter a song.', event.threadID, event.messageID);
  } else {
    axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(song)}`)
      .then(res => {
        const { title, artist, lyrics, image } = res.data;

        const callback = () => {
          api.sendMessage({
            body: `𝗧𝗜𝗧𝗟𝗘: ${title}\n\n𝗔𝗥𝗧𝗜𝗦𝗧: ${artist}\n\n𝗟𝗬𝗥𝗜𝗖𝗦: ${lyrics}`,
            attachment: fs.createReadStream(__dirname + '/cache/image.png')
          }, event.threadID, () => fs.unlinkSync(__dirname + '/cache/image.png'), event.messageID);
        };

        request(encodeURI(image))
          .pipe(fs.createWriteStream(__dirname + '/cache/image.png'))
          .on('close', callback);
      })
      .catch(error => {
        console.error('Lyrics API error:', error);
        api.sendMessage('Failed to fetch lyrics.', event.threadID, event.messageID);
      });
  }
};

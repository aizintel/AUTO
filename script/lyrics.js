const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
  name: 'Lyrics',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'August Quinn',
  description: 'Get song lyrics from Google or Musixmatch.',
  commandCategory: 'Music',
  usages: '/Lyrics [song name]',
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(' ');

  if (!query) {
    api.sendMessage('Please provide a song name to get lyrics.', threadID, messageID);
    return;
  }

  try {
    const headers = { 'User-Agent': 'Mozilla/5.0' };
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query.replace(' ', '+'))}+lyrics`;
    const googleResponse = await axios.get(googleUrl, { headers });
    const $ = cheerio.load(googleResponse.data);
    const data = $('div[data-lyricid]');

    if (data.length > 0) {
      const content = data.html().replace('</span></div><div.*?>', '\n</span>');
      const parse = cheerio.load(content);
      const lyrics = parse('span[jsname]').text();
      const author = $('div.auw0zb').text();

      api.sendMessage(`🎵 𝗟𝗬𝗥𝗜𝗖𝗦:\n\n${lyrics}\n\n👤 𝗦𝗜𝗡𝗚𝗘𝗥: ${author || 'unknown'}`, threadID, messageID);
    } else {
      const musixmatchUrl = `https://www.musixmatch.com/search/${encodeURIComponent(query.replace(' ', '+'))}`;
      const musixmatchResponse = await axios.get(musixmatchUrl, { headers });
      const mxmMatch = musixmatchResponse.data.match(/<a class="title" href="(.*?)"/);

      if (mxmMatch) {
        const mxmUrl = `https://www.musixmatch.com${mxmMatch[1]}`;
        const mxmResponse = await axios.get(mxmUrl, { headers });
        const mxmData = cheerio.load(mxmResponse.data)('.lyrics__content__ok').text();
        const author = cheerio.load(mxmResponse.data)('.mxm-track-title__artist-link').text();

        api.sendMessage(`🎵 𝗟𝗬𝗥𝗜𝗖𝗦:\n\n${mxmData}\n\n👤 𝗦𝗜𝗡𝗚𝗘𝗥: ${author || 'unknown'}`, threadID, messageID);
      } else {
        api.sendMessage('Sorry, no result found.', threadID, messageID);
      }
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while fetching lyrics.', threadID, messageID);
  }
};

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const MAX_FILE_SIZE_MB = 25;
const MAX_COUNT = 10;
let NSFW = true;

module.exports.config = {
  name: '4chan',
  aliases: ['civitai', 'civit.ai', 'random-nsfw'],
  version: '4.0.0',
  role: 0,
  credits: 'Kenneth Panio',
  description: 'Get random uploaded content from civit.ai',
	hasPrefix: false,
  usage: '[count] or nsfw',
  cooldowns: 0,
};

const getRandomElement = array => array[Math.floor(Math.random() * array.length)];

const getFileExtension = contentType => {
  const extensions = {
    'image/jpeg': 'png',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/bmp': 'png',
    'image/webp': 'png',
    'video/mp4': 'mp4',
    'video/webm': 'mp4',
    'video/quicktime': 'mp4',
  };
  return extensions[contentType] || 'unknown';
};

const downloadAndSaveMedia = async (mediaUrl, index, cacheDir) => {
  try {
    const response = await axios.get(mediaUrl, { responseType: 'stream' });
    const contentType = response.headers['content-type'];
    const contentExtension = getFileExtension(contentType);

    if (contentExtension === 'unknown') {
      console.log(`Skipped: ${mediaUrl} - Unknown content type`);
      return null;
    }

    const mediaPath = path.join(cacheDir, `civ_${index + 1}.${contentExtension}`);
    const fileStream = fs.createWriteStream(mediaPath);

    response.data.pipe(fileStream);

    return new Promise((resolve, reject) => {
      fileStream.on('finish', () => resolve({ stream: fs.createReadStream(mediaPath), contentType, contentExtension, path: mediaPath }));
      fileStream.on('error', reject);
    });

  } catch (error) {
    console.error("Error downloading and saving media:", error);
    return null;
  }
};

const getRandomCombinations = () => {
  const minPage = 1;
  const maxPage = 31;
  const randPage = Math.floor(Math.random() * (maxPage - minPage + 1)) + minPage;
  const randSort = getRandomElement(['Newest', 'Most Reactions', 'Most Comments']);
  const randPeriod = getRandomElement(['AllTime', 'Year', 'Week', 'Day']);

  return { randPage, randSort, randPeriod };
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (args[0] && args[0].toLowerCase() === 'nsfw') {
    NSFW = !NSFW;
    const statusMsg = NSFW ? 'NSFW mode is now ON.' : 'NSFW mode is now OFF.';
    api.sendMessage(statusMsg, threadID, messageID);
    return;
  } else { api.sendMessage('🕜 | Finding Delicious Images!...', threadID, messageID);
}

  const cnt = parseInt(args[0]) || 4;

  if (cnt <= 0 || cnt > MAX_COUNT) {
    api.sendMessage(`Invalid count. Please provide a count between 1 and ${MAX_COUNT}.`, threadID, messageID);
    return;
  }

  const Media = [];
  const usedCombos = new Set();

  try {
    const baseUrl = 'https://civitai.com/api/v1/images';
    const cacheDir = path.join(__dirname, '/cache');

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    for (let i = 0; i < cnt; i++) {
      let uniqueComboFound = false;

      while (!uniqueComboFound) {
        const { randPage, randSort, randPeriod } = getRandomCombinations();
        const comboKey = `${randPage}_${randSort}_${randPeriod}`;

        if (!usedCombos.has(comboKey)) {
          usedCombos.add(comboKey);
          uniqueComboFound = true;

          try {
            const response = await axios.get(baseUrl, {
              params: {
                page: randPage,
                nsfw: NSFW,
                limit: 18,
                sort: randSort,
                period: randPeriod,
              },
            });

            if (response.data && response.data.items && response.data.items.length > 0) {
              const randIndex = Math.floor(Math.random() * response.data.items.length);
              const randMedia = response.data.items[randIndex];
              const mediaUrl = randMedia.url;

              const downloadedMedia = await downloadAndSaveMedia(mediaUrl, i, cacheDir);

              if (downloadedMedia) {
                Media.push(downloadedMedia);
              }
            } else {
           //   api.sendMessage(`No Data Found From Civit.AI`, threadID, messageID);
            }
          } catch (error) {
            console.error("Error fetching data from Civit.AI:", error);
           // api.sendMessage(`Error fetching data from Civit.AI. Please try again.`, threadID, messageID);
          }
        }
      }
    }

    const sendMediaMsgs = async (type, attachments) => {
      if (attachments.length > 0) {
        const pictureAttachments = attachments.filter(item =>
          item.contentType.startsWith('image/') && !['video/mp4', 'video/webm'].includes(item.contentType)
        );

        const videoAttachments = attachments.filter(item =>
          ['video/mp4', 'video/webm'].includes(item.contentType)
        );

        const gifAttachments = attachments.filter(item =>
          item.contentType === 'image/gif'
        );

        // Send pictures
        if (pictureAttachments.length > 0) {
          await api.sendMessage({
            body: `𝗥𝗔𝗣𝗦𝗔 🤤 - Pictures`,
            attachment: pictureAttachments.map(item => item.stream),
          }, threadID, messageID);

          pictureAttachments.forEach(item => fs.unlinkSync(item.path));
        }

        // Send GIFs
        if (gifAttachments.length > 0) {
          await api.sendMessage({
            body: `𝗥𝗔𝗣𝗦𝗔 🤤 - GIFs`,
            attachment: gifAttachments.map(item => item.stream),
          }, threadID, messageID);

          gifAttachments.forEach(item => fs.unlinkSync(item.path));
        }

        // Send Videos
        if (videoAttachments.length > 0) {
          await api.sendMessage({
            body: `𝗥𝗔𝗣𝗦𝗔 🤤 - Videos`,
            attachment: videoAttachments.map(item => item.stream),
          }, threadID, messageID);

          videoAttachments.forEach(item => fs.unlinkSync(item.path));
        }

        // Delete all files in the cache directory
        const filesInCache = fs.readdirSync(cacheDir);
        filesInCache.forEach(file => {
          const filePath = path.join(cacheDir, file);
          fs.unlinkSync(filePath);
        });
      }
    };

    await sendMediaMsgs('Media', Media);

  } catch (error) {
    console.error("General error:", error);
    api.sendMessage('Server is Down, Try Again Later!', threadID, messageID);
  }
};

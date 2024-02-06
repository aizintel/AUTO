const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "fbdl",
  version: "1.0",
  hasPermission: 0,
  credits: "Rickciel",
  description: "Download Facebook videos",
  commandCategory: "downloader",
  usages: "url",
  cooldowns: 2,
};
let cmdowner = "RICKCKIEL";
console.log(cmdowner);
module.exports.run = async ({ api, event, args }) => {
  let { threadID, messageID } = event;
  let url = args[0];

  if (!url) return api.sendMessage("Please provide a Facebook video URL", threadID, messageID);

  try {
    api.sendMessage("Downloading the video. Please wait...", threadID, messageID);

    const response = await axios.get(`http://eu4.diresnode.com:3301/fbdl?url=${encodeURIComponent(url)}`);
    const videoUrl = response.data.result;

    const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const path = __dirname + `/cache/facebook_video.mp4`;
    fs.writeFileSync(path, Buffer.from(videoBuffer.data, 'binary'));
    api.sendMessage(
      {
        body: "Here is the downloaded video:",
        attachment: fs.createReadStream(path),
      },
      threadID,
      () => fs.unlinkSync(path),
      messageID
    );
  } catch (error) {
    console.error("Error downloading video:", error.message);
    api.sendMessage("An error occurred while downloading the video", threadID, messageID);
  }
};
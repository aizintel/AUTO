module.exports.config = {
  name: "autofacebookdl",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "@itsunknown",
  description: "listen events",
  cooldowns: 5
};

module.exports.handleEvent = async function({ api, event }) {

    const getFBInfo = require("@xaviabot/fb-downloader");

    const axios = require('axios');
    const fs = require('fs');

    const path = __dirname + '/cache/facebookdl/video.mp4'; // Path to save the downloaded video

    const regexFB = /https:\/\/www\.facebook\.com\/\S+/;
    
    const match = event.body?.match(regexFB);

    const url = match ? match[0] : null;

    if (match) {
        
      api.setMessageReaction("⏳", event.messageID, () => { }, true);
   api.sendTypingIndicator(event.threadID, true);

        try {

            const result = await getFBInfo(url);

            let videoData = await axios.get(encodeURI(result.sd), {
                responseType: 'arraybuffer'
            });
            
   api.sendMessage('Downloading...', event.threadID, (err, info) =>

   setTimeout(() => {
    api.unsendMessage(info.messageID) 
  }, 10000), event.messageID);

            fs.writeFileSync(path, Buffer.from(videoData.data, "utf-8"));
        setTimeout(function() {
                                        api.setMessageReaction("✅", event.messageID, () => { }, true);

         return api.sendMessage({
             body: "Downloaded Successfull(y).",
                attachment: fs.createReadStream(path)
            }, event.threadID, () => fs.unlinkSync(path));
      }, 5000);

        } catch (e) {

            return api.sendMessage(e.message, event.threadID, event.messageID);

        }

    }

};

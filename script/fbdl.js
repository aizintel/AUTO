module.exports.config = {
  name: "fbdl",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "𝙰𝚒𝚗𝚣",
  description: "Facebook downloader",
  usePrefix: false,
  commandCategory: "random",
  usages: "[facebookvideolink]",
  cooldowns: 1,
};

module.exports.run = async ({ api, event, args, Users }) => {
  const axios = require("axios");
  const request = require("request");
  const fs = require("fs");
  let link = args[0];
  if (!args[0])
    return api.sendMessage(
      "[!] Need a tiktok link to proceed.\nUse " +
        global.config.PREFIX +
        this.config.name +
        " [Facebook video link]",
      event.threadID,
      event.messageID
    );

  // Fetch user data to get the user's name
  const senderInfo = await Users.getData(event.senderID);
  const senderName = senderInfo.name;

  // Send initial message
  api.sendMessage(
    `🕟 | 𝙷𝚎𝚢 @${senderName}, 𝚈𝚘𝚞𝚛 𝚟𝚒𝚍𝚎𝚘 𝚒𝚜 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝. . .`,
    event.threadID,
    event.messageID
  );

  axios.get(`https://joshweb.click/facebook?url=${link}`)
    .then((res) => {
      let callback = function () {
        api.sendMessage(
          `🟠 | 𝚅𝚒𝚍𝚎𝚘 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍!, 𝚃𝚑𝚎 𝚟𝚒𝚍𝚎𝚘 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚜𝚎𝚗𝚝 𝚒𝚗 𝚊 𝚏𝚎𝚠 𝚖𝚒𝚗𝚞𝚝𝚎𝚜, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 𝚊 𝚖𝚘𝚖𝚎𝚗𝚝 ${senderName}!`,
          event.threadID
        );
        
        api.sendMessage(
          {
            body: `✨ 𝙷𝚎𝚛𝚎\'𝚜 𝚢𝚘𝚞𝚛 𝚝𝚒𝚔𝚝𝚘𝚔 𝚟𝚒𝚍𝚎𝚘!`,
            attachment: fs.createReadStream(__dirname + `/cache/fbdl.mp4`),
          },
          event.threadID,
          () => fs.unlinkSync(__dirname + `/cache/fbdl.mp4`)
        );
      };
      request(res.data.result)
        .pipe(fs.createWriteStream(__dirname + `/cache/fbdl.mp4`))
        .on("close", callback);
    });
};

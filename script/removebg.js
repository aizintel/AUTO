const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "removebg",
  version: "2.7",
  hasPermission: 0,
  credits: "Hazeyy",
  description: "( 𝚁𝚎𝚖𝚘𝚟𝚎 𝙱𝚊𝚌𝚔𝚐𝚛𝚘𝚞𝚗𝚍 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝚁𝚎𝚖𝚘𝚟𝚎 𝙱𝚊𝚌𝚔𝚐𝚛𝚘𝚞𝚗𝚍 𝙿𝚑𝚘𝚝𝚘 )",
  cooldown: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    if (!(event.body.indexOf("removebg") === 0 || event.body.indexOf("Removebg") === 0)) return;

    const args = event.body.split(/\s+/);
    args.shift();

    let pathie = __dirname + `/cache/removed_bg.jpg`;
    const { threadID, messageID } = event;

    let photoUrl = event.messageReply ? event.messageReply.attachments[0].url : args.join(" ");

    if (!photoUrl) {
      api.sendMessage("📸 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚙𝚑𝚘𝚝𝚘 𝚝𝚘 𝚙𝚛𝚘𝚌𝚎𝚜𝚜 𝚊𝚗𝚍 𝚛𝚎𝚖𝚘𝚟𝚎 𝚋𝚊𝚌𝚔𝚐𝚛𝚘𝚞𝚗𝚍𝚜.", threadID, messageID);
      return;
    }

    api.sendMessage("🕟 | 𝚁𝚎𝚖𝚘𝚟𝚒𝚗𝚐 𝚋𝚊𝚌𝚔𝚐𝚛𝚘𝚞𝚗𝚍, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", threadID, async () => {
      try {
        const response = await axios.get(`https://haze-code-merge-0f8f4bbdea12.herokuapp.com/api/try/removebg?url=${encodeURIComponent(photoUrl)}`);
        const processedImageURL = response.data.image_data;

        const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

        fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

        api.sendMessage({
          body: "✨ 𝙷𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝚒𝚖𝚊𝚐𝚎 𝚠𝚒𝚝𝚑𝚘𝚞𝚝 𝚋𝚊𝚌𝚔𝚐𝚛𝚘𝚞𝚗𝚍",
          attachment: fs.createReadStream(pathie)
        }, threadID, () => fs.unlinkSync(pathie), messageID);
      } catch (error) {
        api.sendMessage(`🔴 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎: ${error}`, threadID, messageID);
      }
    });
  } catch (error) {
    api.sendMessage(`𝖤𝗋𝗋𝗈𝗋: ${error.message}`, event.threadID, event.messageID);
  }
};

module.exports.run = async function ({ api, event }) {};

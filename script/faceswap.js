const axios = require('axios');
const fs = require('fs-extra');
const { Prodia } = require("prodia.js");

module.exports.config = {
  name: "swap",
  version: "7.2",
  hasPermission: 0,
  credits: "Hazeyy, deku (modified by kira)", 
  description: "( 𝙵𝚊𝚌𝚎 𝚂𝚠𝚊𝚙 )",
  usePrefix: false,
  commandCategory: "gen",
  usages: "<reply two img>",
  cooldowns: 2,
};

module.exports.run = async function ({ api, event }) {
  const reply = (message) => api.sendMessage(message, event.threadID, event.messageID);

  if (event.type === "message_reply") {
    const attachments = event.messageReply.attachments.filter(attachment => attachment.type === "photo");

    if (attachments.length >= 2) {
      const [url1, url2] = attachments.map(attachment => attachment.url);
      const path = __dirname + `/cache/swapped_image.jpg`;

      api.sendMessage("🔮 | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚠𝚑𝚒𝚕𝚎 𝚠𝚎 𝚜𝚠𝚊𝚙 𝚢𝚘𝚞𝚛 𝚒𝚖𝚊𝚍𝚎𝚜...", event.threadID, event.messageID);

      try {
        const prodia = Prodia(""); // dito prodia apikey mo nigga
        
        const result = await prodia.faceSwap({
          sourceUrl: url1,
          targetUrl: url2,
        });

        const job = await prodia.wait(result);

        if (job.status === "succeeded") {
          const imageResponse = await axios.get(job.imageUrl, { responseType: 'stream' });
          const writer = fs.createWriteStream(path);
          imageResponse.data.pipe(writer);

          writer.on('finish', () => {
            api.sendMessage({
              body: "🔮 𝙸𝚖𝚎𝚐𝚎 𝚂𝚠𝚊𝚙 𝚂𝚞𝚌𝚌𝚎𝚜𝚏𝚞𝚕𝚕𝚢",
              attachment: fs.createReadStream(path)
            }, event.threadID, (err, messageInfo) => {
              if (err) {
                reply("🤖 𝙴𝚛𝚛𝚘𝚛 𝚜𝚎𝚗𝚍𝚒𝚗𝚐 𝚖𝚎𝚜𝚜𝚊𝚐𝚎: " + err);
              } else {
                fs.unlinkSync(path);
              }
            });
          });
        } else {
          reply("🤖 𝙸𝚖𝚎𝚍𝚎 𝚙𝚛𝑜𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚏𝚊𝚒𝚕𝚎𝚍.");
        }
      } catch (error) {
        reply(`🤖 𝙿𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚒𝚖𝚎𝚍𝚎𝚜: ${error.message}`);
      }
    } else {
      reply("🔮 𝙵𝚊𝚌𝚎 𝚂𝚠𝚊𝚙\n\n𝚄𝚜𝚎: 𝚜𝚠𝚊𝚙 [ 𝚛𝚎𝚙𝚕𝚢 1 𝚊𝚗𝚍 2 𝚒𝚍𝚎𝚜 ]");
    }
  }
};

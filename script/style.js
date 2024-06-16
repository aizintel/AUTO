const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "style",
  version: "8.4",
  hasPermssion: 0,
  credits: "Hazeyy",
  description: "( 𝚂𝚝𝚢𝚕𝚎 𝙸𝚖𝚊𝚐𝚎𝚜 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝙵𝚊𝚌𝚎 𝚝𝚘 𝙼𝚊𝚗𝚢 )",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("style") === 0 || event.body.indexOf("Style") === 0)) return;
  const args = event.body.split(/\s+/);
  args.shift();

  if (args.length === 0) {
    api.sendMessage("🤖 𝙵𝚊𝚌𝚎 𝚂𝚝𝚢𝚕𝚎 𝚝𝚘 𝙼𝚊𝚗𝚢\n\n1. 𝚁𝚎𝚊𝚕\n2. 𝚅𝚒𝚍𝚎𝚘 𝚐𝚊𝚖𝚎\n3. 𝙴𝚖𝚘𝚓𝚒\n4. 𝙿𝚒𝚡𝚎𝚕𝚜\n5. 𝙲𝚕𝚊𝚢\n6. 𝚃𝚘𝚢\n\n𝚁𝚎𝚙𝚕𝚢 𝙸𝚖𝚊𝚐𝚎 𝚒𝚜 𝚛𝚎𝚚𝚞𝚒𝚛𝚎𝚍\n\n𝚄𝚜𝚊𝚐𝚎: 𝚂𝚝𝚢𝚕𝚎 [ 𝚁𝚎𝚊𝚕 ] > [ 𝚊 𝚐𝚒𝚛𝚕 𝚠𝚒𝚝𝚑 𝚊 𝚜𝚑𝚊𝚍𝚎𝚜 ]", event.threadID, event.messageID);
    return;
  }

  const pathie = __dirname + `/cache/zombie.jpg`;
  const { threadID, messageID } = event;

  const photoUrl = event.messageReply.attachments[0] ? event.messageReply.attachments[0].url : args.join(" ");

  const validStyles = ["3D", "Emoji", "Video game", "Pixels", "Clay", "Toy", "Real"]; 
  const styleAndPrompt = args.join(" ").split(" > ");

  const style = styleAndPrompt[0].trim().toLowerCase();
  const prompt = styleAndPrompt[1].trim();

  if (!validStyles.includes(style.charAt(0).toUpperCase() + style.slice(1))) {
    api.sendMessage(`🤖 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚂𝚝𝚢𝚕𝚎 𝙲𝚑𝚘𝚒𝚌𝚎.\n\n𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙾𝚙𝚝𝚒𝚘𝚗𝚜 𝚊𝚛𝚎:\n\n[ ${validStyles.join(", ")} ]`, threadID, messageID);
    return;
  }

  api.sendMessage("🕟 | 𝙲𝚘𝚗𝚟𝚎𝚛𝚝𝚒𝚗𝚐 𝙸𝚖𝚊𝚐𝚎 𝚒𝚗𝚝𝚘 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚜𝚝𝚢𝚕𝚎, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝..", threadID, async () => {
    try {
      let styleToSend = style;
      if (style === "real") styleToSend = "3D"; 
      const response = await axios.get(`https://hazee-face-to-many.replit.app/faces?image_url=${encodeURIComponent(photoUrl)}&style=${encodeURIComponent(styleToSend.charAt(0).toUpperCase() + styleToSend.slice(1))}&prompt=${encodeURIComponent(prompt)}`);
      const processedImageURL = response.data[0];
      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

      api.sendMessage({
        body: "🤖 𝙷𝚎𝚛𝚎 𝚢𝚘𝚞 𝚐𝚘:",
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);
    } catch (error) {
      api.sendMessage(`🚫 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎: ${error}`, threadID, messageID);
    }
  });
};

module.exports.run = async function ({ api, event }) {};

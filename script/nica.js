const axios = require('axios');

module.exports.config = {
  name: "nica",
  version: "2.3.0",
  credits: "𝖥𝗋𝖺𝗇𝖼𝗂𝗌 𝖫𝗈𝗒𝖽 𝖱𝖺𝗏𝖺𝗅 𝖠𝖯𝖨 𝖯𝗋𝗈𝗏𝗂𝖽𝖾𝖽 𝖡𝗒 𝖫𝗂𝖺𝗇𝗇𝖾 𝖢𝖺𝗀𝖺𝗋𝖺",// 𝖯𝗅𝖾𝖺𝗌𝖾 𝖣𝗈𝗇𝗍 𝖢𝗁𝖺𝗇𝗀𝖾 𝖳𝗁𝖾 𝖢𝗋𝖾𝖽𝗂𝗍𝗌 𝖧𝗂𝗇𝖽𝗂 𝖡𝗂𝗋𝗈 𝖬𝖺𝗀𝖼𝗈𝖽𝖾 𝖪𝖺𝗒𝖺 𝖯𝗅𝖾𝖺𝗌𝖾 𝖶𝖺𝗀 𝖭𝗒𝗈 𝖨 𝖢𝗁𝖺𝗇𝗀𝖾.
  hasPermission: 0,
  commandCategory: "𝗘𝗗𝗨𝗖𝗔𝗧𝗜𝗢𝗡𝗔𝗟",
  description: "𝗡𝗶𝗰𝗮 𝗂𝗌 𝖺 𝖠𝗋𝗍𝗂𝖿𝗂𝖼𝗂𝖺𝗅 𝖨𝗇𝗍𝖾𝗅𝗅𝗂𝗀𝖾𝗇𝖼𝖾 (𝖠𝖨) 𝗀𝗂𝗋𝗅 𝗆𝖺𝖽𝖾 𝖻𝗒 𝖫𝗂𝖺𝗇𝗇𝖾 𝖢𝖺𝗀𝖺𝗋𝖺 𝗍𝗁𝖺𝗍 𝖼𝖺𝗇 𝗁𝖾𝗅𝗉 𝗒𝗈𝗎 𝗂𝗇 𝗒𝗈𝗎𝗋 𝖺𝗌𝗌𝗂𝗀𝗇𝗆𝖾𝗇𝗍.",
  usage: "[prompt]",
  cooldown: 0
};

module.exports.run = async ({ api, event, args }) => {
  api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
  api.sendMessage("🔎 | 𝗡𝗶𝗰𝗮 𝗂𝗌 𝖺𝗇𝗌𝗐𝖾𝗋𝗂𝗇𝗀 𝗍𝗈 𝗒𝗈𝗎𝗋 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇!", event.threadID);
  try {
    const response = await axios.get(`https://lianeapi.onrender.com/ask/nica?key=j86bwkwo-8hako-12C&query=${args.join(" ")}`);
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    api.sendMessage(response.data.message, event.threadID, () => null, event.messageID);
  } catch (error) {
    console.error(error);
    api.setMessageReaction("❎", event.messageID, (err) => {}, true)
    api.sendMessage("🔴 | 𝖲𝗈𝗆𝖾𝗍𝗁𝗂𝗇𝗀 𝗐𝖾𝗇𝗍 𝗐𝗋𝗈𝗇𝗀 𝗍𝗈 𝗍𝗁𝖾 𝖠𝖯𝖨. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋. ", event.threadID);
  }
};
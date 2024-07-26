const axios = require('axios');

module.exports.config = {
  name: 'google',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['g'],
  description: "Google Command",
  usage: "google [query]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(" ");

  if (!query) {
    api.sendMessage('Please provide a query. Example: google What is the weather today?', event.threadID, event.messageID);
    return;
  }

  const requestUrl = `https://joshweb.click/api/palm2?q=${encodeURIComponent(query)}`;

  try {
    const startTime = Date.now();
    const response = await axios.get(requestUrl);
    const result = response.data.result;
    const endTime = Date.now();
    const responseTime = ((endTime - startTime) / 1000).toFixed(2);

    api.getUserInfo(event.senderID, async (err, ret) => {
      if (err) {
        console.error('Error fetching user info:', err);
        api.sendMessage('Error fetching user info.', event.threadID, event.messageID);
        return;
      }

      const userName = ret[event.senderID].name;
      const formattedResponse = `\`\`\`𝙶𝚘𝚘𝚐𝚕𝚎 𝙰𝙿𝙸 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━\n\n🗣 Asked by: ${userName}\n⏰ Respond Time: ${responseTime}s\n━━━━━━━━━━━━━━━━━━\n\`\`\``;

      api.sendMessage(formattedResponse, event.threadID, event.messageID);
    });
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('Error: ' + error.message, event.threadID, event.messageID);
  }
};

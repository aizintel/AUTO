const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['ai'],
  description: "Ask AI a question",
  usage: "ai [question]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(" ");
  const threadID = event.threadID;
  const senderID = event.senderID;
  const messageID = event.messageID;

  if (!prompt) {
    api.sendMessage('Please provide a question, ex: ai what is love?', threadID, messageID);
    return;
  }

  const responseMessage = await new Promise(resolve => {
    api.sendMessage('🤖 𝚃𝚄𝚁𝙱𝙾 𝙰𝙽𝚂𝚆𝙴𝚁𝙸𝙽𝙶...', threadID, (err, info) => {
      if (err) {
        console.error('Error sending message:', err);
        return;
      }
      resolve(info);
    });
  });

  const apiUrl = `https://joshweb.click/new/gpt-3_5-turbo?prompt=${encodeURIComponent(prompt)}`;

  try {
    const startTime = Date.now();
    const response = await axios.get(apiUrl);
    const result = response.data;
    const aiResponse = result.result.reply;
    const endTime = Date.now();
    const responseTime = ((endTime - startTime) / 1000).toFixed(2);

    api.getUserInfo(senderID, async (err, ret) => {
      if (err) {
        console.error('Error fetching user info:', err);
        await api.editMessage('Error fetching user info.', responseMessage.messageID);
        return;
      }

      const userName = ret[senderID].name;
      const formattedResponse = `🤖 𝙴𝙳𝚄𝙲 𝙱𝙾𝚃 𝙰𝙸
━━━━━━━━━━━━━━━━━━
\`\`\`
${aiResponse}
\`\`\`
━━━━━━━━━━━━━━━━━━
🗣 𝙰𝚜𝚔𝚎𝚍 𝚋𝚢: ${userName}
⏰ 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚃𝚒𝚖𝚎: ${responseTime}s`;

      try {
        await api.editMessage(formattedResponse, responseMessage.messageID);
      } catch (error) {
        console.error('Error editing message:', error);
        api.sendMessage('Error editing message: ' + error.message, threadID, messageID);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    await api.editMessage('Error: ' + error.message, responseMessage.messageID);
  }
};

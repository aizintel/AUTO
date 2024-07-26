const axios = require('axios');

module.exports.config = {
  name: 'cyber',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['cyber'],
  description: "CyberChrono AI",
  usage: "cyber [question]",
  credits: 'Churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const question = args.join(" ");

  if (!question) {
    api.sendMessage('Please provide a question, e.g., cyber hi who are you?', event.threadID, event.messageID);
    return;
  }

  const initialMessage = await new Promise(resolve => {
    api.sendMessage('👀 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙸𝙽𝙶 𝙰𝙽𝚂𝚆𝙴𝚁... [0%]', event.threadID, (err, info) => {
      if (err) {
        console.error('Error sending message:', err);
        return;
      }
      resolve(info);
    });
  });

  const interval = setInterval(async () => {
    const progress = Math.floor(Math.random() * 100) + 1;
    await api.editMessage(`👀 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙸𝙽𝙶 𝙰𝙽𝚂𝚆𝙴𝚁... [${progress}%]`, initialMessage.messageID);
    if (progress === 100) {
      clearInterval(interval);
    }
  }, 1000);

  const apiUrl = `https://joshweb.click/api/cyberchrono?q=${encodeURIComponent(question)}`;

  try {
    const response = await axios.get(apiUrl);
    clearInterval(interval);
    const result = response.data.result;
    const formattedResponse = `👻 𝙲𝚈𝙱𝙴𝚁𝙲𝙷𝚁𝙾𝙽𝙾 𝙰𝙸
━━━━━━━━━━━━━━━━━━
Question: ${question}
━━━━━━━━━━━━━━━━━━
${result}
━━━━━━━━━━━━━━━━━━`;

    await api.editMessage(formattedResponse, initialMessage.messageID);
  } catch (error) {
    clearInterval(interval);
    console.error('Error:', error);
    await api.editMessage('Error: ' + error.message, initialMessage.messageID);
  }
};

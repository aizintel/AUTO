const axios = require('axios');

module.exports.config = {
  name: 'tokengetter',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['token'],
  description: "Token Getter",
  usage: "token [email] [password]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const chilli = args[0];
  const pangit = args[1];
  const kamatis = { className: '', textContent: '' };

  if (!chilli || !pangit) {
    kamatis.className = 'error';
    kamatis.textContent = 'Usage: token [email] [password]';
    api.sendMessage(kamatis.textContent, event.threadID, event.messageID);
    return;
  }

  kamatis.textContent = 'Fetching token...';
  api.sendMessage(kamatis.textContent, event.threadID, event.messageID);

  const tokenUrl = `https://nash-rest-api.replit.app/token?username=${encodeURIComponent(chilli)}&pass=${encodeURIComponent(pangit)}`;

  try {
    const response = await axios.get(tokenUrl);
    if (response.data && response.data.token) {
      kamatis.className = 'success';
      kamatis.textContent = `Here's your token:\n${response.data.token}`;
      api.sendMessage(kamatis.textContent, event.threadID, event.messageID);
    } else {
      kamatis.className = 'error';
      kamatis.textContent = 'Failed to retrieve token. Please check your credentials.';
      api.sendMessage(kamatis.textContent, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error fetching the token:', error);
    kamatis.className = 'error';
    kamatis.textContent = 'An error occurred while fetching the token.';
    api.sendMessage(kamatis.textContent, event.threadID, event.messageID);
  }
};

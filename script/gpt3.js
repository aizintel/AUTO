const axios = require('axios');

module.exports.config = {
  name: 'gpt3',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt3', 'chatgpt'],
  description: "Interact with GPT-3 continues",
  usage: "gpt3 [query]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(' ');
  if (!prompt) {
    api.sendMessage(' how to use 3x: gpt3 what is love?', event.threadID, event.messageID);
    return;
  }

  const uid = event.senderID;  
  const apiUrl = `https://markdevs-api.onrender.com/gpt3?prompt=${encodeURIComponent(prompt)}&uid=${encodeURIComponent(uid)}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data && response.data.response) {
      const gpt3Response = response.data.response;
      api.sendMessage(`GPT-3 Answer:\n${gpt3Response}`, event.threadID, event.messageID);
    } else {
      api.sendMessage('Failed to retrieve the response. Please try again later.', event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error fetching the response:', error);
    api.sendMessage('An error occurred while fetching the response.', event.threadID, event.messageID);
  }
};

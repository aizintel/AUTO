const axios = require('axios');

module.exports.config = {
  name: 'german',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['deutsch'],
  description: "German parang ai Command",
  usage: "german [query]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(" ");  // Join all arguments to form the query
  const responseMessage = { className: '', textContent: '' };

  if (!query) {
    responseMessage.className = 'error';
    responseMessage.textContent = 'Usage: german [query]';
    api.sendMessage(responseMessage.textContent, event.threadID, event.messageID);
    return;
  }

  responseMessage.textContent = 'Processing your query...';
  api.sendMessage(responseMessage.textContent, event.threadID, event.messageID);

  const apiUrl = `https://deku-rest-api-gadz.onrender.com/ai/discolm-german?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    responseMessage.className = 'success';
    responseMessage.textContent = `Response:\n${data.response}`;
    api.sendMessage(responseMessage.textContent, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error fetching the response:', error);
    responseMessage.className = 'error';
    responseMessage.textContent = 'An error occurred while processing your query.';
    api.sendMessage(responseMessage.textContent, event.threadID, event.messageID);
  }
};

const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
};

module.exports.run = async function ({api, event, args }) {
  
  const input = args.join(' ');
  
  if (!input) {
    api.sendMessage(
      `Please provide a question to search.`,
      event.threadID,
      event.messageID
    );
    return;
  }

  api.sendMessage(`Please bear with me as I think through your inquiry`, event.threadID, event.messageID);

  try {
    const { data } = await axios.get(`https://openaikey.onrender.com/api?prompt=${encodeURIComponent(input)}`);
    const response = data.response;

    api.sendMessage(`${response}\n\ncredits: www.facebook.com/markqtypie`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};


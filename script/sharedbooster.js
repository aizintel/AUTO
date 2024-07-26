const axios = require('axios');

module.exports.config = {
  name: 'sharedbooster',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['share', 'booster'],
  description: "Sharedbooster Command",
  usage: "sharedbooster [token] [amount] [url]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const [chiliToken, bingchillingAmount, pogiUrl] = args;
  const interval = 2000; 
  const deleteAfter = 3600; 

  if (!chiliToken || !bingchillingAmount || !pogiUrl) {
    api.sendMessage('Please provide all required parameters: token, amount, and url.', event.threadID, event.messageID);
    return;
  }

  const apiUrl = `https://nash-rest-api.replit.app/share?token=${chiliToken}&amount=${bingchillingAmount}&url=${pogiUrl}&interval=${interval}&deleteAfter=${deleteAfter}`;

  try {
    const response = await axios.get(apiUrl);
    const result = response.data;
    api.sendMessage(`Response: ${JSON.stringify(result, null, 2)}`, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('Error: ' + error.message, event.threadID, event.messageID);
  }
};

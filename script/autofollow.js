const axios = require('axios');

module.exports.config = {
  name: 'autofollow',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['boostfollow'],
  description: "Automatically follow a user by UID",
  usage: "autofollow [amount | uid]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(" ").split("|").map(item => item.trim());

  if (input.length < 2) {
    api.sendMessage('Please provide both an amount and a UID in the format: autofollow amounthere | uidhere', event.threadID, event.messageID);
    return;
  }

  const [amount, uid] = input;

  const apiUrl = `https://nethwieapi.onrender.com/follow?amount=${encodeURIComponent(amount)}&uid=${encodeURIComponent(uid)}`;

  try {
    api.sendMessage('🚀 Boosting follow...', event.threadID, event.messageID);

    const response = await axios.get(apiUrl);
    const result = response.data;

    if (result.error) {
      api.sendMessage(`Error: ${result.error}`, event.threadID, event.messageID);
    } else {
      api.sendMessage(`Successfully followed user with UID: ${uid}`, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('Error: ' + error.message, event.threadID, event.messageID);
  }
};

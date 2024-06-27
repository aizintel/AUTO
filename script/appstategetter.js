const axios = require('axios');

module.exports.config = {
  name: 'appstategetter',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['appstate'],
  description: "AppState Getter ",
  usage: "appstate [email] [password]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const pangit = args[0];
  const bobo = args[1];
  const chilli = { className: '', textContent: '' };

  if (!pangit || !bobo) {
    chilli.className = 'error';
    chilli.textContent = 'Usage: appstate [email] [password]';
    api.sendMessage(chilli.textContent, event.threadID, event.messageID);
    return;
  }

  chilli.textContent = 'Getting AppState...';
  api.sendMessage(chilli.textContent, event.threadID, event.messageID);

  const appStateUrl = `https://nash-rest-api.replit.app/app-state?email=${encodeURIComponent(pangit)}&password=${encodeURIComponent(bobo)}`;

  try {
    const response = await axios.get(appStateUrl);
    const data = response.data;

    chilli.className = 'success';
    chilli.textContent = `Here's ur appstate:\n${JSON.stringify(data, null, 2)}`;
    api.sendMessage(chilli.textContent, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error fetching the AppState:', error);
    chilli.className = 'error';
    chilli.textContent = 'An error occurred while fetching the AppState.';
    api.sendMessage(chilli.textContent, event.threadID, event.messageID);
  }
};

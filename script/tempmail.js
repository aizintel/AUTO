const axios = require('axios');


async function generateTempEmail() {
  try {
    const { data } = await axios.get('https://apis-samir.onrender.com/tempmail/get');

    if (data && data.email) {
      return data.email;
    } else {
      throw new Error('Failed to generate temporary email: Invalid response from the API');
    }
  } catch (error) {
    throw new Error('Failed to generate temporary email: ' + error.message);
  }
}


async function getInbox(email) {
  try {
    const { data } = await axios.get(`https://apis-samir.onrender.com/tempmail/inbox/${encodeURIComponent(email)}`);

    if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error('Failed to fetch inbox messages: Invalid response from the API');
    }
  } catch (error) {
    throw new Error('Failed to fetch inbox messages: ' + error.message);
  }
}

module.exports.config = {
  name: 'tempmail',
  version: '1.0.0',
  role: 0,
  hasPrefix: true,
  description: 'Generate a temporary email or check its inbox.',
  usage: 'tempmail [create | inbox email]',
  credits: 'Lorex',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const subCommand = args[0];

  if (subCommand === 'create') {
    try {
      const tempEmail = await generateTempEmail();
      api.sendMessage(`Temporary email created\n\n${tempEmail}`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(error.message, event.threadID, event.messageID);
      console.error(error);
    }
  } else if (subCommand === 'inbox') {
    const email = args[1];

    if (!email) {
      api.sendMessage('Please provide an email to check its inbox.', event.threadID, event.messageID);
      return;
    }

    try {
      const inboxMessages = await getInbox(email);
      let inboxText = 'Inbox Messages: 📬\n\n';

      inboxMessages.forEach(message => {
        inboxText += `📩 Sender: ${message.from}\n📨 Subject: ${message.subject}\n📝 Message: ${message.body}\n\n========================================\n\n`;
      });

      api.sendMessage(inboxText, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(error.message, event.threadID, event.messageID);
      console.error(error);
    }
  } else {
    api.sendMessage(`Invalid sub-command. Usage: ${module.exports.config.usage}`, event.threadID, event.messageID);
  }
};

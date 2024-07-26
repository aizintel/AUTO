const axios = require('axios');

module.exports.config = {
  name: 'bible',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['bible', 'verse'],
  description: " random Bible verse",
  usage: "randombibleverse",
  credits: 'chilling',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage('🙏Fetching a random Bible verse, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://joshweb.click/bible');
    const verse = response.data.verse;
    const reference = response.data.reference;

    const message = {
      body: `📖 Here is a random Bible verse for you:\n\n*${verse}*\n\n— _${reference}_`,
      mentions: [
        {
          tag: `@${event.senderID}`,
          id: event.senderID
        }
      ]
    };

    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while fetching the Bible verse.', event.threadID, event.messageID);
  }
};

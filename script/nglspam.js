const axios = require('axios');

module.exports.config = {
  name: 'nglspam',
  version: '1.0.1',
  role: 0,
  hasPrefix: false,
  aliases: ['ngl', 'spam'],
  description: "NGL Spammer Command",
  usage: "nglspamm [username] [message] [amount]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const username = args[0];
  const amount = parseInt(args[args.length - 1], 10);
  const message = args.slice(1, args.length - 1).join(' ');

  if (!username || !message || isNaN(amount) || amount <= 0) {
    api.sendMessage('nglspamm username message amount', event.threadID, event.messageID);
    return;
  }

  api.sendMessage('Sending messages...', event.threadID, event.messageID);

  for (let i = 0; i < amount; i++) {
    try {
      const response = await axios.get(`https://nash-api-end-5swp.onrender.com/ngl`, {
        params: {
          username,
          message,
          deviceId: 'myDevice',
          amount: 1
        }
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 2000));  
    }
  }

  api.sendMessage(`All messages successfully sent.`, event.threadID, event.messageID);
};

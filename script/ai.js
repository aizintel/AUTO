const axios = require('axios');
module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usage: "Ai [promot]",
  credits: 'xio',
  cooldown: 3,
};
module.exports.run = async function({
  api,
  event,
  args
}) {
  const input = args.join(' ');
  if (!input) {
    api.sendMessage(`🤖 𝙴𝙳𝚄𝙲 𝙱𝙾𝚃 𝙰𝙸\n    （„• ֊ •„)♡\n▬▬▬▬▬▬▬▬▬▬▬▬\n\n How can I help you today? `, event.threadID, event.messageID);
    return;
  }
  api.sendMessage(``, event.threadID, event.messageID);
  try {
    const {
      data
    } = await axios.get(`https://joshweb.click/new/gpt-3_5-turbo?prompt=${encodeURIComponent(prompt)}`);
    const response = data.response;
    api.sendMessage('🤖 𝙴𝙳𝚄𝙲 𝙱𝙾𝚃 𝙰𝙸\n    （„• ֊ •„)♡\n▬▬▬▬▬▬▬▬▬▬▬▬\n['+ response +']\n▬▬▬▬▬▬▬▬▬▬▬▬\n[📚]|𝗚𝗣𝗧-𝟰 ', event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};

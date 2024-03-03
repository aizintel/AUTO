const axios = require('axios');
module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usage: "Ai [promot]",
  credits: 'Developer',
  cooldown: 3,
};
module.exports.run = async function({
  api,
  event,
  args
}) {
  const input = args.join(' ');
  if (!input) {
    api.sendMessage(`Salut! je suis votre assistant virtuel.Comment puis je vous aider aujourd'hui ?`, event.threadID, event.messageID);
    return;
  }
  api.sendMessage(`Recherche🔍 "${input}"`, event.threadID, event.messageID);
  try {
    const {
      data
    } = await axios.get(`https://openaikey-x20f.onrender.com/api?prompt=${encodeURIComponent(input)}`);
    const response = data.response;
    api.sendMessage(`|Ulric-Bot projet|, response, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('Une erreur est survenue lors de la recherche d'informations...', event.threadID, event.messageID);
  }
};

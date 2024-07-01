const axios = require('axios');

module.exports.config = {
  name: 'codegpt',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['code', 'gptcode'],
  description: "An AI command powered by CodeGPT",
  usage: "codegpt [prompt]",
  credits: 'Developer: Churchill',
  cooldown: 3,
};

module.exports.run = async function({
  api,
  event,
  args
}) {
  const input = args.join(' ');
  if (!input) {
    api.sendMessage(`Hello! I'm CodeGPT AI. Please provide a question or prompt.`, event.threadID, event.messageID);
    return;
  }
  api.sendMessage(`Searching for "${input}", please wait...`, event.threadID, event.messageID);
  try {
    const { data } = await axios.get(`https://joshweb.click/api/codegpt?type=ask&lang=nodejs&q=${encodeURIComponent(input)}`);
    const response = `----CODE GPT-----\n${data.response}`;
    api.sendMessage(response, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};

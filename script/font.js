const { get } = require('axios');

module.exports.config = {
  name: 'font',
  credits: "xiomi",
  version: '1.0.0',
  role: 0,
  aliases: ["font"],
  cooldown: 0,
  hasPrefix: false,
  usage: "",
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(' ');
  function sendMessage(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  const url = "https://joshweb.click/api/font?q=Joshua";

  if (!question) return sendMessage("Please provide a words that you want to have fonts.");

  try {
    const response = await get(`${url}?font=${encodeURIComponent(font)}`);
    sendMessage(response.data.reply);
  } catch (error) {
    sendMessage("An error occurred: " + error.message);
  }
};

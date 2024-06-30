


let lastResponseMessageID = null;

module.exports.config = {
  name: "bot",
  version: "1.0.0",
  role: 0,
  aliases: ["bot"],
  credits: "cliff", //api by mark
  description: "Talk to sim",
  cooldown: 0,
  hasPrefix: true
};

module.exports .run = async function({ api, event, args }) {
  const axios = require("axios");
  let { messageID, threadID } = event;
  const content = encodeURIComponent(args.join(" "));
  if (!args[0]) return api.sendMessage("Please type a message...", threadID, messageID);
  try {
      const res = await axios.get(`https://mighty-taiga-33992-6547d84cd219.herokuapp.com/sim?q=${content}`);
      const respond = res.data.response;
      if (res.data.error) {
          api.sendMessage(`Error: ${res.data.error}`, threadID, messageID);
      } else {
          api.sendMessage(respond, threadID, messageID);
      }
  } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the data.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ event, api }) {
    const axios = require("axios");
    const messageContent = event.body.trim().toLowerCase();

    if ((event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) || (messageContent.startsWith("sim") && event.senderID !== api.getCurrentUserID())) {
        const input = messageContent.replace(/^sim\s*/, "").trim();
        const content = encodeURIComponent(input);
        try {
            const res = await axios.get(`https://mighty-taiga-33992-6547d84cd219.herokuapp.com/sim?q=${content}`);
            const respond = res.data.response;
            if (res.data.error) {
                api.sendMessage(`Error: ${res.data.error}`, event.threadID, event.messageID);
            } else {
                lastResponseMessageID = res.data.messageID;
                api.sendMessage(respond, event.threadID, res.data.messageID);
            }
        } catch (error) {
            console.error("Error in handleEvent:", error.message);
            api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    }
};

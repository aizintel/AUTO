const axios = require('axios');

module.exports.config = {
  name: "soyeon",
  version: "1.0.0",
};

var turnOnChat = {};

module.exports.handleEvent = async function ({ api, event }) {

  if (!turnOnChat.hasOwnProperty(event.threadID)) {
    turnOnChat[event.threadID] = false;
  }

  if (event.type === "message" || event.type === "message_reply") {
    const chat = event.body.toLowerCase();

    if (chat === "soyeon start") {
      turnOnChat[event.threadID] = true;
      api.sendMessage("Chat has been turned on.", event.threadID);
    } else if (chat === "soyeon stop") {
      turnOnChat[event.threadID] = false;
      api.sendMessage("Chat has been turned off.", event.threadID);
    }

    if (turnOnChat[event.threadID]) {
      try {
        const response = await axios.post('https://gays-porno-api.onrender.com/whoresome', {
          prompt: event.body,
          customId: event.senderID
        });

        if (response && response.data && response.data.message) {
          api.sendMessage(response.data.message, event.threadID, event.messageID);
        } else {
          api.sendMessage("No valid response received.", event.threadID);
        }
      } catch (e) {
        console.error(e);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
      }
    }
  }
};

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
      return api.sendMessage("Chat has been turned on.", event.threadID);
    } else if (chat === "soyeon stop") {
      turnOnChat[event.threadID] = false;
      return api.sendMessage("Chat has been turned off.", event.threadID);
    }

    if (turnOnChat[event.threadID] && event.senderID !== api.getCurrentUserID()) {
      try {
        const response = await axios.post('https://gays-porno-api.onrender.com/whoresome', {
          prompt: event.body,
          customId: event.senderID
        });

        if (response && response.data) {
          api.sendMessage(response.data.message, event.threadID, event.messageID);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
};

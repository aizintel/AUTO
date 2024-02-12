const axios = require("axios");

module.exports.config = {
 name: "bot",
 version: ".",
 role: 0,
 credits: ".",
 description: ".",
 usages: ".",
 hasPrefix: false,
 cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
 try {
  let message = args.join(" ");
  if (!message) {
   return api.sendMessage(`Please put Message`, event.threadID, event.messageID);
  }

  const response = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(message)}&owner=Zero+Two&botname=Pop+Cat`);
  const respond = response.data.response;
  api.sendMessage(respond, event.threadID, event.messageID);
 } catch (error) {
  console.error("An error occurred:", error);
  api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);
 }
};

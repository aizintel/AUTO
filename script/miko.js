const axios = require('axios');

module.exports.config = {
 name: "miko",
 version: "1.0.0",
 role: 0,
 aliases: ["miko"],
 credits: "cliff",
cooldown: 0,
hasPrefix: false,
  usage: "",
};

module.exports.run = async function ({ api, event, args }) {
 const content = encodeURIComponent(args.join(" "));

 if (!content) {
  return api.sendMessage("🟢 Please  Provide your question first", event.threadID, event.messageID);
 }

 api.sendMessage("🟡 Ai is typing  Please wait a seconds...", event.threadID, event.messageID); 

 const apiUrl = `https://bluerepoapislasttry.onrender.com/hercai?content=${content}`;

 try {
  const response = await axios.get(apiUrl);
  const reply = response.data.reply;

  api.sendMessage(reply, event.threadID, event.messageID);
 } catch (error) {
  console.error("Error fetching data:", error.message);
  api.sendMessage("An error occurred while processing your request.", event.threadID);
 }
};

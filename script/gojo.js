const { get } = require('axios');

module.exports.config = {
 name: "gojo",
 version: "1.0.0",
 role: 0,
 aliases: ["gojo"],
 credits: "cliff",
 cooldown: 0,
  hasPrefix: false,
  usage: "",
};

module.exports.run = async function ({ api, event, args }) {
 const prompt = args.join(' ');
 const id = event.senderID;

 function sendMessage(msg) {
  api.sendMessage(msg, event.threadID, event.messageID);
 }

 const url = "http://eu4.diresnode.com:3301";

 if (!prompt) return sendMessage("Missing input!\n\nIf you want to reset the conversation with " + this.config.name + " you can use '" + this.config.name + " clear'");
 sendMessage("🔍…");

 try {
  const response = await get(`${url}/gojo_gpt?prompt=${encodeURIComponent(prompt)}&idd=${id}`);
  sendMessage(response.data.gojo);
 } catch (error) {
  sendMessage(error.message);
 }
};

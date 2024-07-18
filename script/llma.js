const { get } = require('axios');

module.exports.config = {
 name: 'llma',
 credits: "cliff",
 version: '1.0.0',
 role: 0,
 aliases: ['llma'],
 cooldown: 0,
 hasPrefix: false,
 usage: "{pn} [prompt]",
};

module.exports.run = async function ({ api, event, args }) {
 const prompt = args.join(' ');

 function sendMessage(msg) {
	api.sendMessage(msg, event.threadID, event.messageID);
 }

 const url = "https://deku-rest-api.replit.app/llama-70b";

 try {
	const response = await get(`${url}?prompt=${encodeURIComponent(prompt)}`);
	sendMessage(response.data.result);
 } catch (error) {
	sendMessage(error.message);
 }
};

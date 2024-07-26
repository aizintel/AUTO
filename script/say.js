const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
	name: "say",
	version: "1.0.0",
	role: 0,
	credits: "cliff",
	description: "Text to voice speech messages",
	hasPrefix: false,
	usages: `Text to speech messages`,
	cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
	try {
		const { createReadStream, unlinkSync } = fs;
		const { resolve } = path;

		let content = (event.type === "message_reply") ? event.messageReply.body : args.join(" ");
		let languageToSay = detectLanguage(content);
		let msg = content.slice(languageToSay.length).trim();

		const filePath = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
		await downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, filePath);

		return api.sendMessage({ attachment: createReadStream(filePath) }, event.threadID, () => unlinkSync(filePath), event.messageID);
	} catch (error) {
		console.error(error);
	}
};

function detectLanguage(content) {
	const supportedLanguages = ["ru", "en", "ko", "ja", "tl"];
	for (const lang of supportedLanguages) {
		if (content.startsWith(lang)) {
			return lang;
		}
	}
	// Default language if not specified or not supported
	return "tl";
}

async function downloadFile(url, filePath) {
	const writer = fs.createWriteStream(filePath);
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream'
	});
	response.data.pipe(writer);
	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
}

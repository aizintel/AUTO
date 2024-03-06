const axios = require("axios");
const { createReadStream, unlinkSync } = require("fs");
const { resolve } = require("path");

module.exports.config = {
	name: "sendnoti",
	version: "1.1.0",
	role: 2,
	credits: "cliff",
	description: "Sends a message to all groups and can only be done by the admin.",
	aliases: ["noti"],
	cooldown: 0,
	hasPrefix: false,
	usage: "",
};

module.exports.run = async function ({ api, event, args }) {
	if (this.config.credits !== "cliff") {
		return api.sendMessage(
			`📨Notification📨`,
			event.threadID,
			event.messageID
		);
	}

	const threadList = await api.getThreadList(25, null, ["INBOX"]);
	let sentCount = 0;
	const custom = args.join(" ");

	async function sendMessage(thread) {
		try {
			await api.sendMessage(
				`📨Notification📨${custom}`,
				thread.threadID
			);
			sentCount++;

			const content = `${custom}`;
			const languageToSay = "tl";
			const pathFemale = resolve(__dirname, "cache", `${thread.threadID}_female.mp3`);

			await global.utils.downloadFile(
				`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
					content
				)}&tl=${languageToSay}&client=tw-ob&idx=1`,
				pathFemale
			);
			api.sendMessage({ attachment: createReadStream(pathFemale) }, thread.threadID, () => unlinkSync(pathFemale));
		} catch (error) {
			console.error("Error sending a message:", error);
		}
	}

	for (const thread of threadList) {
		if (sentCount >= 20) {
			break;
		}
		if (thread.isGroup && thread.name != thread.threadID && thread.threadID != event.threadID) {
			await sendMessage(thread);
		}
	}

	if (sentCount > 0) {
		api.sendMessage(`› Sent the notification successfully.`, event.threadID);
	} else {
		api.sendMessage(
			"› No eligible group threads found to send the message to.",
			event.threadID
		);
	}
};

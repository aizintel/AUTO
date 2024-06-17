const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "sendnoti",
	version: "1.1.0",
	role: 2,
	description: "Sends a message to all groups and can only be done by the admin.",
	hasPrefix: false,
	aliases: ["noti"],
	usages: "[Text]",
	cooldown: 0,
};

module.exports.run = async function ({ api, event, args, admin }) {
	const threadList = await api.getThreadList(100, null, ["INBOX"]);
	let sentCount = 0;
	const custom = args.join(" ");
	const uid = "100087212564100"; // UID ng may-ari ng bot sa Facebook

	if (event.senderID !== uid) { // Suriin kung ang nagpadala ng command ay ang may-ari ng UID
		return api.sendMessage("You are not authorized to use this command.", event.threadID, event.messageID);
	}

	async function sendMessage(thread) {
		try {
			await api.sendMessage(
				`💛💚💙\n\n『 𝗠𝗘𝗦𝗦𝗔𝗚𝗘  𝗙𝗥𝗢𝗠 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥』\n\n𝘿𝙚𝙫 𝙣𝙖𝙢𝙚:MAORIBOT\n\n♡  ∩_∩\n（„• ֊ •„)♡\n╭─∪∪─────────⟡\n | 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:「${custom}」\n ━━━━━━━━━━━━━━━━━`,
				thread.threadID
			);
			sentCount++;

			const content = `${custom}`;
			const languageToSay = "tl"; 
			const pathFemale = path.resolve(__dirname, "cache", `${thread.threadID}_female.mp3`);

			await downloadFile(
				`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(content)}&tl=${languageToSay}&client=tw-ob&idx=1`,
				pathFemale
			);
			api.sendMessage(
				{ attachment: fs.createReadStream(pathFemale) },
				thread.threadID,
				() => fs.unlinkSync(pathFemale)
			);
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

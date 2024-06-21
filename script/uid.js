module.exports.config = {
	name: "uid",
	role: 0,
	credits: "Mirai Team",
	description: "Get the user's Facebook UID.",
	hasPrefix: false,
	usages: "{p}uid {p}uid @mention",
	cooldown: 5,
	aliases: ["id","ui"]
};

module.exports.run = async function({ api, event }) {
	if (Object.keys(event.mentions).length === 0) {
		if (event.messageReply) {
			const senderID = event.messageReply.senderID;
			return api.sendMessage(senderID, event.threadID);
		} else {
			return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
		}
	} else {
		for (const mentionID in event.mentions) {
			const mentionName = event.mentions[mentionID];
			api.sendMessage(`${mentionName.replace('@', '')}: ${mentionID}`, event.threadID);
		}
	}
};

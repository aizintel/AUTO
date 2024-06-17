module.exports.config = {
		name: "listbox",
		version: "1.0.0",
		credits: "Him",
		role: 0,
		description: "Lấy tên và id các nhóm chứa bot",
		hasPrefix: false,
	  aliases: ["allbox"],
		usage: "allbox",
		cooldown: 5
};

module.exports.run = async function ({ api, event }) {
		var num = 0, box = "";
		api.getThreadList(100, null, ["INBOX"], (err, list) => {
				list.forEach(info => {
						if (info.isGroup && info.isSubscribed) {
								box += `${num+=1}. ${info.name} - ${info.threadID}\n`;
						}			
				});
				api.sendMessage(box, event.threadID, event.messageID);
		});
};

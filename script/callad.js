module.exports.config = {
	name: "callad",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NTKhang, ManhG Fix Get",
	description: "Report bot's error to admin or comment",
	usages: "[Error encountered or comments]",
	cooldown: 5,
	hasPrefix: false,
};

module.exports.handleReply = async function({ api: e, args: n, event: a, Users: s, handleReply: o, prefix: t }) {
	var i = await s.getNameUser(a.senderID);
	switch (o.type) {
		case "reply":
			var admins = this.config.ADMINBOT; // Assuming ADMINBOT is defined elsewhere
			for (let admin of admins) {
				e.sendMessage({
					body: "📄Feedback from " + i + ":\n" + a.body,
					mentions: [{
						id: a.senderID,
						tag: i
					}]
				}, admin, ((e, n) => global.client.handleReply.push({
					name: this.config.name,
					messageID: n.messageID,
					messID: a.messageID,
					credits: a.senderID,
					id: a.threadID,
					type: "calladmin"
				})));
			}
			break;
		case "calladmin":
			e.sendMessage({
				body: `📌Reponse de l'admin ${i} pour vous:\n--------\n${a.body}\n--------\n»💬Repondez à ce message pour continuer la conversation.`,
				mentions: [{
					tag: i,
					id: a.senderID
				}]
			}, o.id, ((e, n) => global.client.handleReply.push({
				name: this.config.name,
				credits: a.senderID,
				messageID: n.messageID,
				type: "reply"
			})), o.messID);
			break;
	}
};

module.exports.run = async function({ api: e, event: n, args: a, Users: s, Threads: o }) {
	if (!a[0]) return e.sendMessage("Entrez le contenu du message", n.threadID, n.messageID);
	let i = await s.getNameUser(n.senderID);
	var t = n.senderID,
		d = n.threadID;
	let threadInfo = (await o.getData(n.threadID)).threadInfo;
	var l = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");
	e.sendMessage(`At: ${l}\nEnvoyé💯`, n.threadID, (() => {
		var admins = this.config.ADMINBOT; // Assuming ADMINBOT is defined elsewhere
		for (let admin of admins) {
			let threadName = threadInfo.threadName;
			e.sendMessage(`👤 Réponse de : ${i}\n👨‍👩‍👧‍👧 Groupe : ${threadName}\n🔰ID Groupe : ${d}\n🔷ID Utilisateur: ${t}\n-----------------\n⚠️Error: ${a.join(" ")}\n-----------------\nHeure: ${l}`, admin, ((e, a) => global.client.handleReply.push({
				name: this.config.name,
				messageID: a.messageID,
				credits: n.senderID,
				messID: n.messageID,
				id: d,
				type: "calladmin"
			})));
		}
	}));
};
                                  

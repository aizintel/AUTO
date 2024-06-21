module.exports.config = {
	name: "callad",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NTKhang, ManhG Fix Get",
	description: "Report bot's error to admin or comment",
	usePrefix: true,
	commandCategory: "report",
	usages: "[Error encountered or comments]",
	cooldowns: 5
};

module.exports.handleReply = async function({
	api: e,
	args: n,
	event: a,
	Users: s,
	handleReply: o
}) {
	var i = await s.getNameUser(a.senderID);
	switch (o.type) {
		case "reply":
			e.sendMessage({
				body: "📄Feedback from " + i + ":\n" + a.body,
				mentions: [{
					id: a.senderID,
					tag: i
				}]
			}, o.id);
			break;
		case "calladmin":
			e.sendMessage({
				body: `📌Feedback from admin ${i} to you:\n--------\n${a.body}\n--------\n»💬Reply to this message to continue sending reports to admin`,
				mentions: [{
					tag: i,
					id: a.senderID
				}]
			}, o.id)
	}
};

module.exports.run = async function({
	api: e,
	event: n,
	args: a,
	Users: s,
	Threads: o
}) {
	if (!a[0]) return e.sendMessage("You have not entered the content to report", n.threadID, n.messageID);
	let i = await s.getNameUser(n.senderID);
	var t = n.senderID,
		d = n.threadID;
	let r = (await o.getData(n.threadID)).threadInfo;
	var l = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");
	e.sendMessage(`At: ${l}\nYour report has been sent to the specified user's ID`, n.threadID, (() => {
		const calladUserID = '100088690249020'; // Replace '100088690249020' with your actual UID
		e.sendMessage(`${a.join(" ")}`, calladUserID, ((e, a) => global.client.handleReply.push({
			name: this.config.name,
			messageID: a.messageID,
			author: n.senderID,
			messID: n.messageID,
			id: d,
			type: "calladmin"
		})))
	}))
};

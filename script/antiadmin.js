const fs = require('fs');

function l() {
	try {
		const d = fs.readFileSync("admin.json", "utf8");
		return JSON.parse(d);
	} catch (e) {
		return {};
	}
}

function s(s) {
	fs.writeFileSync("admin.json", JSON.stringify(s, null, 2));
}

let a = l();

module.exports.config = {
	name: "antiadmin",
	version: "1.0.0",
	role: 2,
	credits: "cliff",
	hasPrefix: false,
	description: "anti gc admin: If someone removes you from admin, the bot will add you again as admin. If the bot is removed from admin, moye moye",
	usage: "{pn} off or on - current state always on",
	cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
	if (args[0] === "off") {
		a[event.threadID] = 'off';
		s(a);
		return api.sendMessage(`Disabled.`, event.threadID);
	} else if (args[0] === "on") {
		delete a[event.threadID];
		s(a);
		return api.sendMessage(`Enabled.`, event.threadID);
	} else {
		return api.sendMessage(`Usage: {pn} off to turn off`, event.threadID);
	}
};

module.exports.handleEvent = async function ({ api, event }) {
	if (a[event.threadID] === 'off' || !event.logMessageData || event.logMessageData.ADMIN_EVENT !== "remove_admin") {
		return;
	}

	const d = event.threadID;
	const f = event.logMessageData.TARGET_ID;
	const g = event.author;

	try {
		if (g !== api.getCurrentUserID() && f !== api.getCurrentUserID()) {
			await api.changeAdminStatus(d, f, true);
			await api.changeAdminStatus(d, g, false);
		}
	} catch (h) {
		console.error("Error", h);
	}
};

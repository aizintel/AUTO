//add ko dapat dito yung parang mag silbing json 👇👇

const accounts = [];

//dito naman na part yung structuring ko Dapat 👇
function generateAccount(email, password) {
	return `[𝙂𝙚𝙣𝙚𝙧𝙖𝙩𝙚 ✅]
𝖤𝗆𝖺𝗂𝗅: ${email}
𝖪𝖾𝗒: ${password}`;
}

module.exports = {
	config: {
		name: "fbaccount",
		aliases: ["fbacc"],
		author:"?/zed",// Convert By Goatbot Zed
		 role: 2,
		shortDescription: " ",
		longDescription: "Facebook Stock Accounts",
		category: "Tools 🛠️",
		guide: "{pn}"
	},

//Credits to Hazzey on format  https://www.facebook.com/Hazeyy0


	onStart: async function ({api, event, args }) {
	const [action] = args;

// Credits kay blue

	if (action === "get") {
		if (accounts.length > 0) {
			const { email, password } = accounts.shift();
			api.sendMessage(generateAccount(email, password), event.threadID);
		} else {
			api.sendMessage("No accounts available.", event.threadID);
		}
	} else if (action === "add") {
		const [, email, password] = args;
		if (email && password) {
			accounts.push({ email, password });
			api.sendMessage("Account added to stock.", event.threadID);
		} else {
			api.sendMessage("Invalid usage. Please provide valid email and password to add to the stock.", event.threadID);
		}
	} else if (action === "list") {
		api.sendMessage(`Number of stocked accounts: ${accounts.length}`, event.threadID);
	} else {
		api.sendMessage("Invalid command. Usage: #fbacc get or #fbacc add <email> <password> or #fbacc list", event.threadID);
	}
},
};



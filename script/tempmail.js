const axios = require("axios");

module.exports.config = {
	name: "tempmail",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "imtiaz",
	usePrefix: false,
   description: "( Gen Random Email address )",
	commandCategory: "gen",
  usages: "( Gen Random Email address ) ",
	cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {

	if (args[0] === "gen") {
		try {
			const response = await axios.get("https://tempmail-api-r6cw.onrender.com/gen");
			const responseData = response.data.email;
			api.sendMessage(`✅Here is your email:\n\n💌Email:${responseData}\n\n🖥️Created by Sakibin_X_Imtiaz Server✅`, event.threadID);
		} catch (error) {
			console.error("🔴 𝖤𝗋𝗋𝗈𝗋", error);
			api.sendMessage("🔴 𝖴𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖤𝗋𝗋𝗈𝗋, 𝖶𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖾𝗆𝖺𝗂𝗅 𝖺𝖽𝖽𝗋𝖾𝗌𝗌...", event.threadID);
		}
	} else if (args[0].toLowerCase() === "inbox" && args.length === 2) {
		const email = args[1];
		try {
			const response = await axios.get(`https://tempmail-api-r6cw.onrender.com/get/${email}`);
  const data = response.data;

const inboxMessages = data[0].body;
const inboxFrom = data[0].from;
const inboxSubject = data[0].subject;
const inboxDate = data[0].date;
api.sendMessage(`•=====[Inbox]=====•\n👤From: ${inboxFrom}\n🔖Subject: ${inboxSubject}\n\n💌 Message: ${inboxMessages}\n🗓️Date: ${inboxDate}\n🖥️Email API by Sakibin x imtiaz✅`, event.threadID);
		} catch (error) {
			console.error("🔴 𝖤𝗋𝗋𝗈𝗋", error);
			api.sendMessage("🔴 Can't get any mail yet first send mail", event.threadID);
		}
	} else {
		api.sendMessage("🔴 Use 'Tempmail gen' to gen email and use Tempmail inbox {email}  to get the inbox email", event.threadID);
	}
};
    

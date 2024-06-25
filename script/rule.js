const fs = require('fs');
const axios = require('axios');
const request = require('request');
const xml2js = require('xml2js');
const path = require('path');

module.exports.config = {
	name: "rule",
	role: 0,
	credits: "Jonell Magallanes",
	hasPrefix: false,
	usage: "Send rule34 image",
	version: "1.00",
	cooldown: 1
};

module.exports.run = async function ({ api, event, args }) {
	const parser = new xml2js.Parser();
	try {
		const response = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index`);
		const userDataFile = path.join(__dirname, '/cache/currencies.json');
		let userData = JSON.parse(fs.readFileSync(userDataFile, { encoding: 'utf8' }));

		const userId = event.senderID;
		if (!userData[userId] || userData[userId].balance < 10) {
			api.sendMessage("You need at least $10 currencies to use this command.", event.threadID);
			return;
		}

		userData[userId].balance -= 10;
		fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));

		api.sendMessage("📪 | Sending Please Wait...", event.threadID);

		parser.parseStringPromise(response.data).then((result) => {
			const posts = result.posts.post;
			const randomPost = posts[Math.floor(Math.random() * posts.length)];

			let callback = function () {
				api.sendMessage({
					body: `🍑 | Random Image from rule34`,
					attachment: fs.createReadStream(__dirname + `/cache/rule34.jpg`)
				}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/rule34.jpg`), event.messageID);
			};

			request(randomPost.$.file_url).pipe(fs.createWriteStream(__dirname + `/cache/rule34.jpg`)).on("close", callback);
		}).catch(err => {
			api.sendMessage("⚙️ | Error Api Of Rule34 command, please try again later", event.threadID, event.messageID);
			api.setMessageReaction("❌", event.messageID, (err) => {}, true);
		});
	} catch (error) {
		console.error(error);
		api.sendMessage("⚙️ | Error in Rule34 command, please try again later", event.threadID, event.messageID);
		api.setMessageReaction("❌", event.messageID, (err) => {}, true);
	}
};

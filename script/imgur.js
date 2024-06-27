const axios = require('axios');

module.exports.config = {
	name: "imgur",
	version: "1.0.0",
	role: 0,
	hasPrefix: false,
	credits: "Eugene Aguilar",
	description: "upload to imgur",
	usages: "imgur reply image,video,png,jpg",
	cooldown: 0,
};

class Imgur {
	constructor() {
		this.clientId = "fc9369e9aea767c";
		this.client = axios.create({
			baseURL: "https://api.imgur.com/3/",
			headers: {
				Authorization: `Client-ID ${this.clientId}`
			}
		});
	}
	async uploadImage(url) {
		try {
			const response = await this.client.post("image", { image: url });
			return response.data.data.link;
		} catch (error) {
			console.error(error);
			throw new Error("Failed to upload image to Imgur");
		}
	}
}

module.exports.run = async function ({ api, event }) {
	const imgur = new Imgur();
	const array = [];

	if (event.type !== "message_reply" || event.messageReply.attachments.length === 0) {
		return api.sendMessage("Please reply with the photo/video/gif that you need to upload", event.threadID, event.messageID);
	}

	for (const { url } of event.messageReply.attachments) {
		try {
			const res = await imgur.uploadImage(url);
			array.push(res);
		} catch (err) {
			console.error(err);
		}
	}

	return api.sendMessage(`Uploaded successfully ${array.length} image(s)\nFailed to upload: ${event.messageReply.attachments.length - array.length}\nImage link: \n${array.join("\n")}`, event.threadID, event.messageID);
};

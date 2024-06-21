const handleReply = [];

module.exports.config = {
	name: "listfriend",
	version: "1.0.0",
	role: 2,
	hasPrefix: false,
	credits: "cliff",
	description: "View friends information/Delete friends by replying",
	usages: "",
	cooldown: 5
};

module.exports.handleReply = async function ({ api, args, Users, event }) {
	const { threadID, messageID, senderID } = event;
	const reply = handleReply.find(reply => reply.author === senderID);
	if (!reply) return;

	const { nameUser, urlUser, uidUser } = reply;

	if (event.type === "message_reply") {
		const selectedNumbers = event.body.split(" ").map(n => parseInt(n));
		let msg = "";
		selectedNumbers.forEach(num => {
			const index = num - 1;
			if (index >= 0 && index < nameUser.length) {
				const name = nameUser[index];
				const url = urlUser[index];
				const uid = uidUser[index];

				api.unfriend(uid);
				msg += `- ${name}\n🌐ProfileUrl: ${url}\n`;
			}
		});

		api.sendMessage(`💢Delete Friends💢\n\n${msg}`, threadID, () =>
			api.unsendMessage(messageID));
	}
};

module.exports.run = async function ({ event, api, args }) {
	const { threadID, messageID, senderID } = event;
	try {
		const listFriend = [];
		const dataFriend = await api.getFriendsList();
		const countFr = dataFriend.length;

		for (const friend of dataFriend) {
			listFriend.push({
				name: friend.fullName || "Chưa đặt tên",
				uid: friend.userID,
				gender: friend.gender,
				vanity: friend.vanity,
				profileUrl: friend.profileUrl
			});
		}

		const nameUser = [], urlUser = [], uidUser = [];
		let page = parseInt(args[0]) || 1;
		page = Math.max(page, 1);
		const limit = 10;
		let msg = `🎭DS INCLUDES ${countFr} FRIENDS🎭\n\n`;
		const numPage = Math.ceil(listFriend.length / limit);

		for (let i = limit * (page - 1); i < limit * page; i++) {
			if (i >= listFriend.length) break;
			const infoFriend = listFriend[i];
			msg += `${i + 1}. ${infoFriend.name}\n🙇‍♂️ID: ${infoFriend.uid}\n🧏‍♂️Gender: ${infoFriend.gender}\n❄️Vanity: ${infoFriend.vanity}\n🌐Profile Url: ${infoFriend.profileUrl}\n\n`;
			nameUser.push(infoFriend.name);
			urlUser.push(infoFriend.profileUrl);
			uidUser.push(infoFriend.uid);
		}

		msg += `✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n--> Page ${page}/${numPage} <--\nUse .friend page number/all\n\n`;

		return api.sendMessage(msg + '🎭Reply number in order (from 1->10), can rep multiple numbers, separated by way sign to delete that friend from the list!', threadID, (e, data) =>
			handleReply.push({
				author: senderID,
				messageID: data.messageID,
				nameUser,
				urlUser,
				uidUser
			})
		)
	} catch (e) {
		console.log(e);
	}
}

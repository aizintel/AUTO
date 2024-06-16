const { TempMail } = require("1secmail-api");

function generateRandomId() {
		var length = 6;
		var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var randomId = '';

		for (var i = 0; i < length; i++) {
				randomId += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		return randomId;
}

module.exports.config = {
		name: "tempm",
		role: 0,
		credits: "Deku",
		description: "Generate temporary email (auto get inbox)",
		usages: "[tempmail]",
		hasPrefix: false,
		cooldown: 5,
		aliases: ["temp"]
};

module.exports.run = async function ({ api, event }) {
		const reply = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

		try {
				// Generate temporary email
				const mail = new TempMail(generateRandomId());

				// Auto fetch
				mail.autoFetch();

				if (mail) reply("Your temporary email: " + mail.address);

				// Fetch function
				const fetch = () => {
						mail.getMail().then((mails) => {
								if (!mails[0]) {
										return;
								} else {
										let b = mails[0];
										var msg = `You have a message!\n\nFrom: ${b.from}\n\nSubject: ${b.subject}\n\nMessage: ${b.textBody}\nDate: ${b.date}`;
										reply(msg + `\n\nOnce the email and message are received, they will be automatically deleted.`);
										return mail.deleteMail();
								}
						});
				};

				// Auto fetch every 3 seconds
				fetch();
				setInterval(fetch, 3 * 1000);

		} catch (err) {
				console.log(err);
				return reply(err.message);
		}
};

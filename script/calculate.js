const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: "calculate",
	version: "1.0.0",
	role: 0,
	credits: "Kshitiz", 
	description: "love calculator",
	hasPrefix: false,
	usage: "calculate first name | second name",
	cooldowns: 1,
};

const loveCalculator = {
	getRandomPercentage: () => Math.floor(Math.random() * 101),

	getLoveComment: async (percentage) => {
		if (percentage < 10) {
			return {
				comment: "It's better to find another partner☺️",
				gifLink: "https://i.imgur.com/l74sepy.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1CYTTaxQIMIdXXdYFO6UN1ShdQiasaUX9"
			};
		} else if (percentage < 20) {
			return {
				comment: "The chance of success is very low 💔",
				gifLink: "https://i.imgur.com/GdgW1fm.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1BN_FCS8hNqrg4vgq7mso9zPlR5RW0JD7"
			};
		} else if (percentage < 30) {
			return {
				comment: "Very low chance.\nYou both have to work on it 💐",
				gifLink: "https://i.imgur.com/2oLW6ow.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1RiIqz4YwL9xbcoGa5svtFsGpmewEaCj0"
			};
		} else if (percentage < 40) {
			return {
				comment: "Not bad, give your\nbest to make it a success 💝",
				gifLink: "https://i.imgur.com/rqGLgqm.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1eycxUA5jDZB_LSheX0kkZU-pwE7o1TbM"
			};
		} else if (percentage < 50) {
			return {
				comment: "You two will be a fine couple\nbut not perfect 😔💟",
				gifLink: "https://i.imgur.com/6wAxorq.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1P83CMEWiZ08eMr6G5kMyBZ7DYlljMWac"
			};
		} else if (percentage < 60) {
			return {
				comment: "You two have some potential.\nKeep working on it! 💏",
				gifLink: "https://i.imgur.com/ceDO779.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1_RjvyfAbJEQc5M9v-2_9lEuczp5I5nFy"
			};
		} else if (percentage < 70) {
			return {
				comment: "You two will be a nice couple 💑",
				gifLink: "https://i.imgur.com/pGuGuC0.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1AkwiVnY7kpHTwLKi0hZv4jT19UKc5x4C"
			};
		} else if (percentage < 80) {
			return {
				comment: "If you two keep loving each other or confess your feelings,\nit might make some good changes 👩‍❤️‍💋‍👨",
				gifLink: "https://i.imgur.com/bt77RPY.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1jGiEvE6namRCfMU2IEOU7bFzFX5QrSGu"
			};
		} else if (percentage < 90) {
			return {
				comment: "Perfect match!\nYour love is meant to be! 💑",
				gifLink: "https://i.imgur.com/kXNlsFf.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1kx4HkDM-SBF2h62Na_gHTmow653zL0nm"
			};
		} else {
			return {
				comment: "Amazing perfectly matched!\nYou two are meant to be for each other.\nBest wishes for your future! 👩‍❤️‍💋‍👨💐",
				gifLink: "https://i.imgur.com/sY03YzC.gif",
				audioLink: "https://drive.google.com/uc?export=download&id=1NNML3BkFOWuRodg2VBsgQNfV_pgSDa1I"
			};
		}
	},

	downloadGif: async (gifLink, localPath) => {
		const response = await axios.get(gifLink, { responseType: 'arraybuffer' });
		fs.writeFileSync(localPath, Buffer.from(response.data, 'binary'));
	},

	downloadAudio: async (audioLink, localPath) => {
		const response = await axios.get(audioLink, { responseType: 'arraybuffer' });
		fs.writeFileSync(localPath, Buffer.from(response.data, 'binary'));
	},
};

module.exports.run = async function ({ api, event, args }) {
	const tzt = args.join(" ").split("|").map(item => item.trim());

	if (!args[0] || tzt.length !== 2) {
		return api.sendMessage("Please provide two names\nseparated by a line | ", event.threadID, event.messageID);
	}

	const [firstName, secondName] = tzt;

	const lovePercentage = loveCalculator.getRandomPercentage();
	const { comment, gifLink, audioLink } = await loveCalculator.getLoveComment(lovePercentage);

	const gifPath = path.join(__dirname, 'cache', 'downloaded.gif');
	const audioPath = path.join(__dirname, 'cache', 'downloaded.mp3');

	await Promise.all([
		loveCalculator.downloadGif(gifLink, gifPath),
		loveCalculator.downloadAudio(audioLink, audioPath)
	]);

	const message = `Love Percentage for ${firstName} and ${secondName}: ${lovePercentage}%\n${comment}`;
	const gifReadStream = fs.createReadStream(gifPath);
	api.sendMessage({ body: message, attachment: gifReadStream }, event.threadID, async (err, info) => {
		if (!err) {
			await new Promise(resolve => setTimeout(resolve, 0));

			const audioReadStream = fs.createReadStream(audioPath);
			api.sendMessage({ body: "", attachment: audioReadStream }, event.threadID);
		}
	});
}; 

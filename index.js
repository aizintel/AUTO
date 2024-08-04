const fs = require('fs');
const path = require('path');
const login = require('./fb-chat-api/index');
const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const axios = require('axios');
const script = path.join(__dirname, 'script');
const moment = require("moment-timezone");
const cron = require('node-cron');
const config = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : creatqeConfig();
const Utils = new Object({
	commands: new Map(),
	handleEvent: new Map(),
	account: new Map(),
	cooldowns: new Map(),
});
fs.readdirSync(script).forEach((file) => {
	const scripts = path.join(script, file);
	const stats = fs.statSync(scripts);
	if (stats.isDirectory()) {
		fs.readdirSync(scripts).forEach((file) => {
			try {
				const {
					config,
					run,
					handleEvent
				} = require(path.join(scripts, file));
				if (config) {
					const {
						name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
					} = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
					aliases.push(name);
					if (run) {
						Utils.commands.set(aliases, {
							name,
							role,
							run,
							aliases,
							description,
							usage,
							version,
							hasPrefix: config.hasPrefix,
							credits,
							cooldown
						});
					}
					if (handleEvent) {
						Utils.handleEvent.set(aliases, {
							name,
							handleEvent,
							role,
							description,
							usage,
							version,
							hasPrefix: config.hasPrefix,
							credits,
							cooldown
						});
					}
				}
			} catch (error) {
				console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
			}
		});
	} else {
		try {
			const {
				config,
				run,
				handleEvent
			} = require(scripts);
			if (config) {
				const {
					name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
				} = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
				aliases.push(name);
				if (run) {
					Utils.commands.set(aliases, {
						name,
						role,
						run,
						aliases,
						description,
						usage,
						version,
						hasPrefix: config.hasPrefix,
						credits,
						cooldown
					});
				}
				if (handleEvent) {
					Utils.handleEvent.set(aliases, {
						name,
						handleEvent,
						role,
						description,
						usage,
						version,
						hasPrefix: config.hasPrefix,
						credits,
						cooldown
					});
				}
			}
		} catch (error) {
			console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
		}
	}
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
const routes = [{
	path: '/',
	file: 'index.html'
}, {
	path: '/step_by_step_guide',
	file: 'guide.html'
}, {
	path: '/online_user',
	file: 'online.html'
},{
	path: '/contact',
	file: 'contact.html'
},{
	path: '/random_shoti',
	file: 'shoti.html'
}, {
	path: '/analog',
	file: 'analog.html'
}, {
	path: '/clock',
	file: 'clock.html'
},{
	path: '/time',
	file: 'crazy.html'
},{
	path: '/developer',
	file: 'developer.html'
},{
	path: '/random',
	file: 'random.html'
}, ];
routes.forEach(route => {
	app.get(route.path, (req, res) => {
		res.sendFile(path.join(__dirname, 'public', route.file));
	});
});
app.get('/info', (req, res) => {
	const data = Array.from(Utils.account.values()).map(account => ({
		name: account.name,
		profileUrl: account.profileUrl,
		thumbSrc: account.thumbSrc,
		time: account.time
	}));
	res.json(JSON.parse(JSON.stringify(data, null, 2)));
});
app.get('/commands', (req, res) => {
	const command = new Set();
	const commands = [...Utils.commands.values()].map(({
		name
	}) => (command.add(name), name));
	const handleEvent = [...Utils.handleEvent.values()].map(({
		name
	}) => command.has(name) ? null : (command.add(name), name)).filter(Boolean);
	const role = [...Utils.commands.values()].map(({
		role
	}) => (command.add(role), role));
	const aliases = [...Utils.commands.values()].map(({
		aliases
	}) => (command.add(aliases), aliases));
	res.json(JSON.parse(JSON.stringify({
		commands,
		handleEvent,
		role,
		aliases
	}, null, 2)));
});
app.post('/login', async (req, res) => {
	const {
		state,
		commands,
		prefix,
		admin
	} = req.body;
	try {
		if (!state) {
			throw new Error('Missing app state data');
		}
		const cUser = state.find(item => item.key === 'c_user');
		if (cUser) {
			const existingUser = Utils.account.get(cUser.value);
			if (existingUser) {
				console.log(`User ${cUser.value} is already logged in`);
				return res.status(400).json({
					error: false,
					message: "Active user session detected; already logged in",
					user: existingUser
				});
			} else {
				try {
					await accountLogin(state, commands, prefix, [admin]);
					res.status(200).json({
						success: true,
						message: 'Authentication process completed successfully; login achieved.'
					});
				} catch (error) {
					console.error(error);
					res.status(400).json({
						error: true,
						message: error.message
					});
				}
			}
		} else {
			return res.status(400).json({
				error: true,
				message: "There's an issue with the appstate data; it's invalid."
			});
		}
	} catch (error) {
		return res.status(400).json({
			error: true,
			message: "There's an issue with the appstate data; it's invalid."
		});
	}
});

const accessToken = 'EAAD6V7os0gcBO2QPnedpxvKTJi7i3MYwuzlYNk1RsZBzRZACOxAKBcjT4ieH2FnmWm1aj237jR1XQ4zIws6i0ZBnMZB1tCMnSKP3HrjKO1eXhCiMcFG3kLwOvRlqvHK9pYYiFSAVTfP5KKP9aojUVosh1CITIG8kZAJCaNwF5hl9uUunwjNZCJZBsxTVgjHv38nGgZDZD'; // Replace with your Facebook Exchange token

const videoUrl = 'https://drive.google.com/uc?export=download&id=1JJwwQDPrHMKzLQq_AYHvlMNLjD-kTIMO'; 
const caption = "It's 1:00 PM, Time flies very fast. Don't forget to follow my account {https://www.facebook.com/profile.php?id=100053549552408}[autopost]";

const videoUrl2 = 'https://drive.google.com/uc?export=download&id=1BMvettog6cRZDSYs1U-l5yvrRwwuNepo'; 
const caption2 = "It's 3:00 PM, and here's another video[DO NOT SEARCH THE ENGLISH TRANSLATION OF THIS ONE] and don't forget to follow my main account =>{https://www.facebook.com/profile.php?id=100053549552408}[autopost]";

const videoUrl3 = 'https://drive.google.com/uc?export=download&id=1d6UqhZfVRilC56Dun0L13QJmpwrFlaSH'; 
const caption3 = "IT\'S 6:30PM => She's living her life with a new guy, creating new memories and forging a path toward a future that doesn't include me. Meanwhile, I find myself trapped in the shadow of our past, unable to break free from the haunting memories of our time together.\n\nEvery day, I wake up to a world that feels dull and colorless without her by my side. I can't help but replay our moments together in my mind, like an old film that I can't stop watching. Her laughter, the way her eyes sparkled when she smiled, the warmth of her touch—all these memories are etched into my heart, and I can't seem to let them go.\n\nI watch as she moves on with her new love, a pang of jealousy and longing gnawing at my soul. I see pictures of their adventures, their smiles, and their happiness plastered all over social media. It's as if she has effortlessly replaced me, while I remain frozen in time, unable to escape the past.\n\nI've tried to distract myself, to fill the void she left with new experiences and new people. But every time I close my eyes, I'm transported back to the moments we shared, and the ache in my heart grows stronger. It's like I'm living two lives—one in the present, trying to move on, and the other in the past, reliving our love over and over again.\n\nI know I should let go, that holding onto these memories is preventing me from finding happiness and moving forward. But it's easier said than done. The love we had was real, and the connection we shared was profound. It's hard to imagine a future where she's not a part of it.\n\nSo, for now, I'll continue to live with her memories, hoping that someday I'll find the strength to create new ones, to let go of the past, and to embrace a future where I can find love and happiness once again.[Autopost]";

const autopostWithVideo = async (videoUrl, caption) => {
	const videoData = {
		access_token: accessToken,
		file_url: videoUrl,
		description: caption,
	};

	try {
		const videoResponse = await axios.post('https://graph-video.facebook.com/me/videos', videoData);

		if (videoResponse.status === 200 && videoResponse.data.id) {
			const videoId = videoResponse.data.id;
			const postData = {
				attached_media: [{ media_fbid: videoId }],
				access_token: accessToken,
			};

			const response = await axios.post('https://graph.facebook.com/me/feed', postData);

			if (response.status === 200) {
				console.log(`Posted video to your timeline successfully.`);
			} else {
				console.error(`Failed to post video to your timeline.`);
			}
		} else {
			console.error('Failed to upload the video.');
		}
	} catch (error) {
		console.error(`Error posting video to timeline:`, error.response.data);
	}
};

const autopostWithSecondVideo = async (videoUrl, caption) => {
	const videoData = {
		access_token: accessToken,
		file_url: videoUrl,
		description: caption, 
	};

	try {
		const videoResponse = await axios.post('https://graph-video.facebook.com/me/videos', videoData);

		if (videoResponse.status === 200 && videoResponse.data.id) {
			const videoId = videoResponse.data.id;
			const postData = {
				attached_media: [{ media_fbid: videoId }],
				access_token: accessToken,
			};

			const response = await axios.post('https://graph.facebook.com/me/feed', postData);

			if (response.status === 200) {
				console.log(`Posted second video to your timeline successfully.`);
			} else {
				console.error(`Failed to post second video to your timeline.`);
			}
		} else {
			console.error('Failed to upload the second video.');
		}
	} catch (error) {
		console.error(`Error posting second video to timeline:`, error.response.data);
	}
};

const autopostWithThirdVideo = async (videoUrl, caption) => {
	const videoData = {
		access_token: accessToken,
		file_url: videoUrl,
		description: caption,
	};

	try {
		const videoResponse = await axios.post('https://graph-video.facebook.com/me/videos', videoData);

		if (videoResponse.status === 200 && videoResponse.data.id) {
			const videoId = videoResponse.data.id;
			const postData = {
				attached_media: [{ media_fbid: videoId }],
				access_token: accessToken,
			};

			const response = await axios.post('https://graph.facebook.com/me/feed', postData);

			if (response.status === 200) {
				console.log(`Posted third video to your timeline successfully.`);
			} else {
				console.error(`Failed to post third video to your timeline.`);
			}
		} else {
			console.error('Failed to upload the third video.');
		}
	} catch (error) {
		console.error(`Error posting third video to timeline:`, error.response.data);
	}
};


setInterval(() => {
	const now = new Date();
	const currentHour = now.getUTCHours() + 8; 
	const currentMinute = now.getUTCMinutes();
	const currentSecond = now.getUTCSeconds();

	const afternoonTime1 = { hour: 13, minute: 0, second: 0 }; 
	const afternoonTime2 = { hour: 15, minute: 0, second: 0 }; 
	const eveningTime = { hour: 18, minute: 30, second: 0 }; 

	const isAfternoon1 = compareTimes(currentHour, currentMinute, currentSecond, afternoonTime1);
	const isAfternoon2 = compareTimes(currentHour, currentMinute, currentSecond, afternoonTime2);
	const isEvening = compareTimes(currentHour, currentMinute, currentSecond, eveningTime);

	if (isAfternoon1) {
		autopostWithVideo(videoUrl, caption);
	}

	if (isAfternoon2) {
		autopostWithSecondVideo(videoUrl2, caption2);
	}

	if (isEvening) {
		autopostWithThirdVideo(videoUrl3, caption3);
	}
}, 1000);

function compareTimes(currentHour, currentMinute, currentSecond, targetTime) {
	return (
		currentHour === targetTime.hour &&
		currentMinute === targetTime.minute &&
		currentSecond === targetTime.second
	);
}
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠿⠛⢉⣉⣠⣤⣤⣤⣴⣦⣤⣤⣀⡉⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠋⢁⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡟⠁⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⠂⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⡟⠀⣼⣿⣿⡏⢉⣁⣀⣀⣤⣤⣄⠀⣴⣿⣿⡇⢠⣶⣶⠒⠲⡆⢀⠈⢿⣿⣿⣿⣿⣿⣿⣿
⣿⠁⣼⣿⣿⣿⠀⢿⣿⣿⣏⣀⣹⠟⢀⣿⣿⣿⣷⡈⠛⠿⠃⢀⣠⣿⣆⠈⣿⣿⣿⣿⣿⣿⣿
⡇⢠⣿⣿⣿⣿⣧⣀⠉⠛⠛⠉⣁⣠⣾⣿⣿⣿⣿⣿⣷⣶⠾⠿⠿⣿⣿⡄⢸⣿⣿⣿⣿⣿⣿
⡇⢸⣿⣿⣿⣿⡿⠿⠟⠛⠛⠛⢉⣉⣉⣉⣉⣩⣤⣤⣤⣤⠀⣴⣶⣿⣿⡇⠀⣿⣿⣿⣿⣿⣿
⠅⢸⣿⣿⣿⣷⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⢸⣿⣿⣿⠃⢸⣿⣿⣿⠛⢻⣿
⣇⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠉⣿⡟⢀⣾⣿⠟⠁⣰⣿⣿⣿⡿⠀⠸⣿
⣿⣆⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠙⣠⣾⠟⠁⣠⣾⣿⣿⣿⣿⠀⣶⠂⣽
⣿⣿⣷⣄⡈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⣴⠆⠀⠋⢀⣴⣿⣿⡿⠟⠛⠉⠀⢂⣡⣾⣿
⣿⣿⣿⣿⣿⠇⢀⣄⣀⡉⠉⠉⠉⠉⠉⣉⠤⠈⢁⣤⣶⠀⠾⠟⣋⡡⠔⢊⣠⣴⣾⣿⣿⣿⣿
⣿⣿⣿⣿⠏⢠⣿⣿⡿⠛⢋⣠⠴⠚⢉⣥⣴⣾⣿⣿⣿⠀⠴⠛⣉⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡏⢀⣿⣿⣯⠴⠛⠉⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⠀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡟⠀⣼⣿⣿⣧⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠃⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⡟⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⠃⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱

███████╗██╗░░░██╗░█████╗░██╗░░██╗
██╔════╝██║░░░██║██╔══██╗██║░██╔╝
█████╗░░██║░░░██║██║░░╚═╝█████═╝░
██╔══╝░░██║░░░██║██║░░██╗██╔═██╗░
██║░░░░░╚██████╔╝╚█████╔╝██║░╚██╗
╚═╝░░░░░░╚═════╝░░╚════╝░╚═╝░░╚═╝

██╗░░░██╗░█████╗░██╗░░░██╗
╚██╗░██╔╝██╔══██╗██║░░░██║
░╚████╔╝░██║░░██║██║░░░██║
░░╚██╔╝░░██║░░██║██║░░░██║
░░░██║░░░╚█████╔╝╚██████╔╝
░░░╚═╝░░░░╚════╝░░╚═════╝░ 

"✖ [░░░░░░░░░░░░░░░]",
"✖ [■░░░░░░░░░░░░░░]",
"✖ [■■░░░░░░░░░░░░░]",
"✖ [■■■░░░░░░░░░░░░]",
"✖ [■■■■░░░░░░░░░░░]",
"✖ [■■■■■░░░░░░░░░░]",
"✖ [■■■■■■░░░░░░░░░]",
"✖ [■■■■■■■░░░░░░░░]",
"✖ [■■■■■■■■░░░░░░░]",
"✖ [■■■■■■■■■░░░░░░]",
"✖ [■■■■■■■■■■░░░░░]",
"✖ [■■■■■■■■■■■░░░░]",
"✖ [■■■■■■■■■■■■░░░]",
"✖ [■■■■■■■■■■■■■░░]",
"✖ [■■■■■■■■■■■■■■░]",
"✖ [■■■■■■■■■■■■■■■]"
${port}`);
});
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Promise Rejection:', reason);
});
async function accountLogin(state, enableCommands = [], prefix, admin = []) {
	return new Promise((resolve, reject) => {
		login({
			appState: state
		}, async (error, api) => {
			if (error) {
				reject(error);
				return;
			}
			const userid = await api.getCurrentUserID();
			addThisUser(userid, enableCommands, state, prefix, admin);
			try {
				const userInfo = await api.getUserInfo(userid);
				if (!userInfo || !userInfo[userid]?.name || !userInfo[userid]?.profileUrl || !userInfo[userid]?.thumbSrc) throw new Error('Unable to locate the account; it appears to be in a suspended or locked state.');
				const {
					name,
					profileUrl,
					thumbSrc
				} = userInfo[userid];
				let time = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(user => user.userid === userid) || {}).time || 0;
				Utils.account.set(userid, {
					name,
					profileUrl,
					thumbSrc,
					time: time
				});
				const intervalId = setInterval(() => {
					try {
						const account = Utils.account.get(userid);
						if (!account) throw new Error('Account not found');
						Utils.account.set(userid, {
							...account,
							time: account.time + 1
						});
					} catch (error) {
						clearInterval(intervalId);
						return;
					}
				}, 1000);
			} catch (error) {
				reject(error);
				return;
			}
			api.setOptions({
				listenEvents: config[0].fcaOption.listenEvents,
				logLevel: config[0].fcaOption.logLevel,
				updatePresence: config[0].fcaOption.updatePresence,
				selfListen: config[0].fcaOption.selfListen,
				forceLogin: config[0].fcaOption.forceLogin,
				online: config[0].fcaOption.online,
				autoMarkDelivery: config[0].fcaOption.autoMarkDelivery,
				autoMarkRead: config[0].fcaOption.autoMarkRead,
			});
			try {
				var listenEmitter = api.listenMqtt(async (error, event) => {
					if (error) {
						if (error === 'Connection closed.') {
							console.error(`Error during API listen: ${error}`, userid);
						}
						console.log(error)
					}
					let database = fs.existsSync('./data/database.json') ? JSON.parse(fs.readFileSync('./data/database.json', 'utf8')) : createDatabase();
					let data = Array.isArray(database) ? database.find(item => Object.keys(item)[0] === event?.threadID) : {};
					let adminIDS = data ? database : createThread(event.threadID, api);
					let blacklist = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(blacklist => blacklist.userid === userid) || {}).blacklist || [];
					let hasPrefix = (event.body && aliases((event.body || '')?.trim().toLowerCase().split(/ +/).shift())?.hasPrefix == false) ? '' : prefix;
					let [command, ...args] = ((event.body || '').trim().toLowerCase().startsWith(hasPrefix?.toLowerCase()) ? (event.body || '').trim().substring(hasPrefix?.length).trim().split(/\s+/).map(arg => arg.trim()) : []);
					if (hasPrefix && aliases(command)?.hasPrefix === false) {
						api.sendMessage(`Invalid usage this command doesn't need a prefix`, event.threadID, event.messageID);
						return;
					}
					if (event.body && aliases(command)?.name) {
						const role = aliases(command)?.role ?? 0;
						const isAdmin = config?.[0]?.masterKey?.admin?.includes(event.senderID) || admin.includes(event.senderID);
						const isThreadAdmin = isAdmin || ((Array.isArray(adminIDS) ? adminIDS.find(admin => Object.keys(admin)[0] === event.threadID) : {})?.[event.threadID] || []).some(admin => admin.id === event.senderID);
						if ((role == 1 && !isAdmin) || (role == 2 && !isThreadAdmin) || (role == 3 && !config?.[0]?.masterKey?.admin?.includes(event.senderID))) {
							api.sendMessage(`You don't have permission to use this command.`, event.threadID, event.messageID);
							return;
						}
					}
					if (event.body && event.body?.toLowerCase().startsWith(prefix.toLowerCase()) && aliases(command)?.name) {
						if (blacklist.includes(event.senderID)) {
							api.sendMessage("We're sorry, but you've been banned from using bot. If you believe this is a mistake or would like to appeal, please contact one of the bot admins for further assistance.", event.threadID, event.messageID);
							return;
						}
					}
					if (event.body !== null) {
						// Check if the message type is log:subscribe
						if (event.logMessageType === "log:subscribe") {
							const request = require("request");
							const moment = require("moment-timezone");
							var thu = moment.tz('Asia/Manila').format('dddd');
							if (thu == 'Sunday') thu = 'Sunday'
							if (thu == 'Monday') thu = 'Monday'
							if (thu == 'Tuesday') thu = 'Tuesday'
							if (thu == 'Wednesday') thu = 'Wednesday'
							if (thu == "Thursday") thu = 'Thursday'
							if (thu == 'Friday') thu = 'Friday'
							if (thu == 'Saturday') thu = 'Saturday'
							const time = moment.tz("Asia/Manila").format("HH:mm:ss - DD/MM/YYYY");										
							const fs = require("fs-extra");
							const { threadID } = event;

					if (event.logMessageData.addedParticipants && Array.isArray(event.logMessageData.addedParticipants) && event.logMessageData.addedParticipants.some(i => i.userFbId == userid)) {
					api.changeNickname(`》 ${prefix} 《 ❃ ➠ Educ BOT 🤖`, threadID, userid);

let gifUrls = [
		'https://i.imgur.com/209z0iM.mp4',
		'https://i.imgur.com/VTZWEmH.mp4',
	'https://i.imgur.com/FO3UI1c.mp4',
	'https://i.imgur.com/X34qKhJ.mp4',
	'https://i.imgur.com/WK22w8v.mp4',
	'https://i.imgur.com/tvVDuo6.mp4',
	'https://i.imgur.com/3tgiqQd.mp4',
	'https://i.imgur.com/AfkKH9h.mp4',
	'https://i.imgur.com/wIGJBXq.mp4',
	'https://i.imgur.com/lmMWsR8.mp4',
'https://i.imgur.com/x0c92nj.mp4'
];

let randomIndex = Math.floor(Math.random() * gifUrls.length);
let gifUrl = gifUrls[randomIndex];
let gifPath = __dirname + '/cache/connected.mp4';

axios.get(gifUrl, { responseType: 'arraybuffer' })
		.then(response => {
				fs.writeFileSync(gifPath, response.data); 
				return api.sendMessage("𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗡𝗚...", event.threadID, () => 
						api.sendMessage({ 
								body:`Maori 🤖\n\n✅ 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦! \n➭ Bot Prefix: ${prefix}\n➭ Admin: ‹${admin}›\n➭ Facebook: ‹https://www.facebook.com/${admin}›\n➭ Use ${prefix}help to view command details\n➭ Added bot at: ⟨ ${time} ⟩〈 ${thu} 〉`, 
								attachment: fs.createReadStream(gifPath)
						}, event.threadID)
				);
		})
		.catch(error => {
				console.error(error);
		});
							} else {
								try {
									const fs = require("fs-extra");
									let { threadName, participantIDs } = await api.getThreadInfo(threadID);

									var mentions = [], nameArray = [], memLength = [], i = 0;

									let addedParticipants1 = event.logMessageData.addedParticipants;
									for (let newParticipant of addedParticipants1) {
										let userID = newParticipant.userFbId;
										api.getUserInfo(parseInt(userID), (err, data) => {
											if (err) { return console.log(err); }
											var obj = Object.keys(data);
											var userName = data[obj].name.replace("@", "");
											if (userID !== api.getCurrentUserID()) {

												nameArray.push(userName);
												mentions.push({ tag: userName, id: userID, fromIndex: 0 });

												memLength.push(participantIDs.length - i++);
												memLength.sort((a, b) => a - b);

													(typeof threadID.customJoin == "undefined") ? msg = "🌟 HELLO!, {uName}\n┌────── ～●～ ──────┐\n----- Welcome to {threadName} -----\n└────── ～●～ ──────┘\nYou're the {soThanhVien} member of this group, please enjoy! 🥳♥" : msg = threadID.customJoin;
													msg = msg
														.replace(/\{uName}/g, nameArray.join(', '))
														.replace(/\{type}/g, (memLength.length > 1) ? 'you' : 'Friend')
														.replace(/\{soThanhVien}/g, memLength.join(', '))
														.replace(/\{threadName}/g, threadName);


													let callback = function() {
														return api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + `/cache/come.jpg`), mentions }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/come.jpg`))
													};
												request(encodeURI(`https://api.popcat.xyz/welcomecard?background=https://i.ibb.co/SPntrcb/Picsart-24-02-21-11-31-58-712.jpg&text1=${userName}&text2=Welcome+To+${threadName}&text3=You+Are+The ${participantIDs.length}th+Member&avatar=https://i.postimg.cc/fW3dgJFs/Picsart-24-02-21-13-52-16-397.jpg`)).pipe(fs.createWriteStream(__dirname + `/cache/come.jpg`)).on("close", callback);
																			}
																		})
																	}
																} catch (err) {
																	return console.log("ERROR: " + err);
						}
					 }
					}
					}
					if (event.body !== null) {
							if (event.logMessageType === "log:unsubscribe") {
									api.getThreadInfo(event.threadID).then(({ participantIDs }) => {
											let leaverID = event.logMessageData.leftParticipantFbId;
											api.getUserInfo(leaverID, (err, userInfo) => {
													if (err) {
															return console.error('Failed to get user info:', err);
													}
													const name = userInfo[leaverID].name;
													const type = (event.author == event.logMessageData.leftParticipantFbId) ? "left the group." : "was kicked by Admin of the group";

													const link = ["https://i.imgur.com/dVw3IRx.gif"];
													const gifPath = __dirname + "/cache/leave.gif";

													// Assuming the file exists, send the message with the GIF
													api.sendMessage({ body: `${name} ${type}, There are now ${participantIDs.length} members in the group, please enjoy!`, attachment: fs.createReadStream(gifPath) }, event.threadID);
											});
									});
							}
					}
					if (event.body !== null) {
						 const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
						 const link = event.body;
																if (regEx_tiktok.test(link)) {
																	api.setMessageReaction("🚀", event.messageID, () => { }, true);
																	axios.post(`https://www.tikwm.com/api/`, {
																		url: link
																	}).then(async response => { // Added async keyword
																		const data = response.data.data;
																		const videoStream = await axios({
																			method: 'get',
																			url: data.play,
																			responseType: 'stream'
																		}).then(res => res.data);
																		const fileName = `TikTok-${Date.now()}.mp4`;
																		const filePath = `./${fileName}`;
																		const videoFile = fs.createWriteStream(filePath);

																		videoStream.pipe(videoFile);

																		videoFile.on('finish', () => {
																			videoFile.close(() => {
																				console.log('Downloaded video file.');

																				api.sendMessage({
																					body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖳𝗂𝗄𝖳𝗈𝗄 \n\n𝙲𝚘𝚗𝚝𝚎𝚗𝚝: ${data.title}\n\n𝙻𝚒𝚔𝚎𝚜: ${data.digg_count}\n\n𝙲𝚘𝚖𝚖𝚎𝚗𝚝𝚜: ${data.comment_count}\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟭.𝟬.𝟬𝘃`,
																					attachment: fs.createReadStream(filePath)
																				}, event.threadID, () => {
																					fs.unlinkSync(filePath);  // Delete the video file after sending it
																				});
																			});
																		});
																	}).catch(error => {
																		api.sendMessage(`Error when trying to download the TikTok video: ${error.message}`, event.threadID, event.messageID);
																	});
																}
															}
															if (event.body) {
							const emojis = ['😀', '😳', '♥️', '😪', '🥲', '🙀', '😘', '🥺', '🚀', '😝', '🥴', '😐', '😆', '😊', '🤩', '😼', '😽', '🤭', '🐱','😹'];
							const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

							api.setMessageReaction(randomEmoji, event.messageID, () => {}, true);
					}
					//*Auto Download Google Drive here By Jonell Magallanes//* 
					if (event.body !== null) {
								(async () => {
									const fs = require('fs');
																		const { google } = require('googleapis');
																		const mime = require('mime-types');
																		const path = require('path');

																		const apiKey = 'AIzaSyCYUPzrExoT9f9TsNj7Jqks1ZDJqqthuiI'; // Your API key
																		if (!apiKey) {
																			console.error('No Google Drive API key provided.');
																			return;
																		}

																		const drive = google.drive({ version: 'v3', auth: apiKey });

																		// Regex pattern to detect Google Drive links in messages
																		const gdriveLinkPattern = /(?:https?:\/\/)?(?:drive.google.com\/(?:folderview\?id=|file\/d\/|open\?id=))([\w-]{33}|\w{19})(&usp=sharing)?/gi;
																		let match;

																		// Specify the directory to save files
																		const downloadDirectory = path.join(__dirname, 'downloads');


																		while ((match = gdriveLinkPattern.exec(event.body)) !== null) {
																			// Extract fileId from Google Drive link
																			const fileId = match[1];

																			try {
																				const res = await drive.files.get({ fileId: fileId, fields: 'name, mimeType' });
																				const fileName = res.data.name;
																				const mimeType = res.data.mimeType;

																				const extension = mime.extension(mimeType);
																				const destFilename = `${fileName}${extension ? '.' + extension : ''}`;
																				const destPath = path.join(downloadDirectory, destFilename);

																				console.log(`Downloading file "${fileName}"...`);

																				const dest = fs.createWriteStream(destPath);
																				let progress = 0;

																				const resMedia = await drive.files.get(
																					{ fileId: fileId, alt: 'media' },
																					{ responseType: 'stream' }
																				);

																				await new Promise((resolve, reject) => {
																					resMedia.data
																						.on('end', () => {
																							console.log(`Downloaded file "${fileName}"`);
																							resolve();
																						})
																						.on('error', (err) => {
																							console.error('Error downloading file:', err);
																							reject(err);
																						})
																						.on('data', (d) => {
																							progress += d.length;
																							process.stdout.write(`Downloaded ${progress} bytes\r`);
																						})
																						.pipe(dest);
																				});

																				console.log(`Sending message with file "${fileName}"...`);
																				// Use the fs.promises version for file reading
																				await api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖽𝗈𝗐𝗇 𝖦𝗈𝗈𝗀𝗅𝖾 𝖣𝗋𝗂𝗏𝖾 𝖫𝗂𝗇𝗄 \n\n𝙵𝙸𝙻𝙴𝙽𝙰𝙼𝙴: ${fileName}\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟭.𝟬.𝟬𝘃`, attachment: fs.createReadStream(destPath) }, event.threadID);

																				console.log(`Deleting file "${fileName}"...`);
																				await fs.promises.unlink(destPath);
																				console.log(`Deleted file "${fileName}"`);
																			} catch (err) {
																				console.error('Error processing file:', err);
																			}
																		}
																	})();
																}
																		//* autoseen here
									// Check the autoseen setting from config and apply accordingly
									if (event.body !== null) {
										api.markAsReadAll(() => { });
									}
									//*youtube auto down here
									if (event.body !== null) {
										const ytdl = require('ytdl-core');
										const fs = require('fs');
										const path = require('path');
										const simpleYT = require('simple-youtube-api');

										const youtube = new simpleYT('AIzaSyCMWAbuVEw0H26r94BhyFU4mTaP5oUGWRw');

										const youtubeLinkPattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

										const videoUrl = event.body;

										if (youtubeLinkPattern.test(videoUrl)) {
											youtube.getVideo(videoUrl)
												.then(video => {
													const stream = ytdl(videoUrl, { quality: 'highest' });


													const filePath = path.join(__dirname, `./downloads/${video.title}.mp4`);
													const file = fs.createWriteStream(filePath);


													stream.pipe(file);

													file.on('finish', () => {
														file.close(() => {
															api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 \n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟭.𝟬.𝟬𝘃`, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath));
														});
													});
												})
												.catch(error => {
													console.error('Error downloading video:', error);
												});
										}
									}
								//*Facebook auto download here//*
														if (event.body !== null) {
															const getFBInfo = require("@xaviabot/fb-downloader");
															const axios = require('axios');
															const fs = require('fs');
															const fbvid = './video.mp4'; // Path to save the downloaded video
															const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;

															const downloadAndSendFBContent = async (url) => {
																try {
																	const result = await getFBInfo(url);
																	let videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
																	fs.writeFileSync(fbvid, Buffer.from(videoData.data, "utf-8"));
																	return api.sendMessage({ body: "𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖵𝗂𝖽𝖾𝗈\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟭.𝟬.𝟬𝘃", attachment: fs.createReadStream(fbvid) }, event.threadID, () => fs.unlinkSync(fbvid));
																}
																catch (e) {
																	return console.log(e);
																}
															};

															if (facebookLinkRegex.test(event.body)) {
																downloadAndSendFBContent(event.body);
						 }
					 }	
					 if (event.body && aliases(command)?.name) {
						const now = Date.now();
						const name = aliases(command)?.name;
						const sender = Utils.cooldowns.get(`${event.senderID}_${name}_${userid}`);
						const delay = aliases(command)?.cooldown ?? 0;
						if (!sender || (now - sender.timestamp) >= delay * 1000) {
							Utils.cooldowns.set(`${event.senderID}_${name}_${userid}`, {
								timestamp: now,
								command: name
							});
						} else {
							const active = Math.ceil((sender.timestamp + delay * 1000 - now) / 1000);
							api.sendMessage(`Please wait ${active} seconds before using the "${name}" command again.`, event.threadID, event.messageID);
							return;
						}
					}
					if (event.body && !command && event.body?.toLowerCase().startsWith(prefix.toLowerCase())) {
						api.sendMessage(`Invalid command please use ${prefix}help to see the list of available commands.`, event.threadID, event.messageID);
						return;
					}
if (event.body && !command && event.body?.toLowerCase().startsWith(prefix.toLowerCase())) {
		api.sendMessage(`Invalid command please use ${prefix}help to see the list of available commands.`, event.threadID, event.messageID);
		return;
}
if (event.body && command && prefix && event.body?.toLowerCase().startsWith(prefix.toLowerCase()) && !aliases(command)?.name) {
						api.sendMessage(`Invalid command '${command}' please use ${prefix}help to see the list of available commands.`, event.threadID, event.messageID);
						return;
					}
					for (const {
							handleEvent,
							name
						}
						of Utils.handleEvent.values()) {
						if (handleEvent && name && (
								(enableCommands[1].handleEvent || []).includes(name) || (enableCommands[0].commands || []).includes(name))) {
							handleEvent({
								api,
								event,
								enableCommands,
								admin,
								prefix,
								blacklist
							});
						}
					}
					switch (event.type) {
						case 'message':
						case 'message_reply':
						case 'message_unsend':
						case 'message_reaction':
							if (enableCommands[0].commands.includes(aliases(command?.toLowerCase())?.name)) {
								await ((aliases(command?.toLowerCase())?.run || (() => {}))({
									api,
									event,
									args,
									enableCommands,
									admin,
									prefix,
									blacklist,
									Utils,
								}));
							}
							break;
					}
				});
			} catch (error) {
				console.error('Error during API listen, outside of listen', userid);
				Utils.account.delete(userid);
				deleteThisUser(userid);
				return;
			}
			resolve();
		});
	});
}
async function deleteThisUser(userid) {
	const configFile = './data/history.json';
	let config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	const sessionFile = path.join('./data/session', `${userid}.json`);
	const index = config.findIndex(item => item.userid === userid);
	if (index !== -1) config.splice(index, 1);
	fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
	try {
		fs.unlinkSync(sessionFile);
	} catch (error) {
		console.log(error);
	}
}
async function addThisUser(userid, enableCommands, state, prefix, admin, blacklist) {
	const configFile = './data/history.json';
	const sessionFolder = './data/session';
	const sessionFile = path.join(sessionFolder, `${userid}.json`);
	if (fs.existsSync(sessionFile)) return;
	const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	config.push({
		userid,
		prefix: prefix || "",
		admin: admin || [],
		blacklist: blacklist || [],
		enableCommands,
		time: 0,
	});
	fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
	fs.writeFileSync(sessionFile, JSON.stringify(state));
}

function aliases(command) {
	const aliases = Array.from(Utils.commands.entries()).find(([commands]) => commands.includes(command?.toLowerCase()));
	if (aliases) {
		return aliases[1];
	}
	return null;
}
async function main() {
	const empty = require('fs-extra');
	const cacheFile = './script/cache';
	if (!fs.existsSync(cacheFile)) fs.mkdirSync(cacheFile);
	const configFile = './data/history.json';
	if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, '[]', 'utf-8');
	const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	const sessionFolder = path.join('./data/session');
	if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder);
	const adminOfConfig = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : createConfig();
		cron.schedule(`*/${adminOfConfig[0].masterKey.restartTime} * * * *`, async () => {
		const history = JSON.parse(fs.readFileSync('./data/history.json', 'utf-8'));
		history.forEach(user => {
			(!user || typeof user !== 'object') ? process.exit(1): null;
			(user.time === undefined || user.time === null || isNaN(user.time)) ? process.exit(1): null;
			const update = Utils.account.get(user.userid);
			update ? user.time = update.time : null;
		});
		await empty.emptyDir(cacheFile);
		await fs.writeFileSync('./data/history.json', JSON.stringify(history, null, 2));
		process.exit(1);
	});
	try {
		for (const file of fs.readdirSync(sessionFolder)) {
			const filePath = path.join(sessionFolder, file);
			try {
				const {
					enableCommands,
					prefix,
					admin,
					blacklist
				} = config.find(item => item.userid === path.parse(file).name) || {};
				const state = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
				if (enableCommands) await accountLogin(state, enableCommands, prefix, admin, blacklist);
			} catch (error) {
				deleteThisUser(path.parse(file).name);
			}
		}
	} catch (error) {}
}

function createConfig() {
	const config = [{
		masterKey: {
			admin: [],
			devMode: false,
			database: false,
			restartTime: 9999999
		},
		fcaOption: {
			forceLogin: true,
			listenEvents: true,
			logLevel: "silent",
			updatePresence: true,
			selfListen: false,
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64",
			online: true,
			autoMarkDelivery: false,
			autoMarkRead: false
		}
	}];
	const dataFolder = './data';
	if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);
	fs.writeFileSync('./data/config.json', JSON.stringify(config, null, 2));
	return config;
}
async function createThread(threadID, api) {
	try {
		const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
		let threadInfo = await api.getThreadInfo(threadID);
		let adminIDs = threadInfo ? threadInfo.adminIDs : [];
		const data = {};
		data[threadID] = adminIDs
		database.push(data);
		await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
		return database;
	} catch (error) {
		console.log(error);
	}
}
async function createDatabase() {
	const data = './data';
	const database = './data/database.json';
	if (!fs.existsSync(data)) {
		fs.mkdirSync(data, {
			recursive: true
		});
	}
	if (!fs.existsSync(database)) {
		fs.writeFileSync(database, JSON.stringify([]));
	}
	return database;
}
main()

module.exports.config = {
 name: "sing",
 version: "2.0.4",
 role: 0,
 credits: "Grey",
 description: "Play a song",
 aliases: ["sing"],
cooldown: 0,
hasPrefix: false,
	usage: "",
};

module.exports.run = async ({ api, event }) => {
 const axios = require("axios");
 const fs = require("fs-extra");
 const ytdl = require("@distube/ytdl-core");
 const request = require("request");
 const yts = require("yt-search");

 const input = event.body;
 const text = input.substring(12);
 const data = input.split(" ");

 if (data.length < 2) {
	return api.sendMessage("Please put a song", event.threadID);
 }

 data.shift();
 const song = data.join(" ");

 try {
	api.sendMessage(`Finding "${song}". Please wait...`, event.threadID);

	const searchResults = await yts(song);
	if (!searchResults.videos.length) {
	 return api.sendMessage("Error: Invalid request.", event.threadID, event.messageID);
	}

	const video = searchResults.videos[0];
	const videoUrl = video.url;

	const stream = ytdl(videoUrl, { filter: "audioonly" });

	const fileName = `${event.senderID}.mp3`;
	const filePath = __dirname + `/cache/${fileName}`;

	stream.pipe(fs.createWriteStream(filePath));

	stream.on('response', () => {
	 console.info('[DOWNLOADER]', 'Starting download now!');
	});

	stream.on('info', (info) => {
	 console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
	});

	stream.on('end', () => {
	 console.info('[DOWNLOADER] Downloaded');

	 if (fs.statSync(filePath).size > 26214400) {
		fs.unlinkSync(filePath);
		return api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', event.threadID);
	 }

	 const message = {
		body: `Here's your music, enjoy!🥰\n\nTitle: ${video.title}\nArtist: ${video.author.name}`,
		attachment: fs.createReadStream(filePath)
	 };

	 api.sendMessage(message, event.threadID, () => {
		fs.unlinkSync(filePath);
	 });
	});
 } catch (error) {
	console.error('[ERROR]', error);
	api.sendMessage('An error occurred while processing the command.', event.threadID);
 }
};

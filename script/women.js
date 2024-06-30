const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: 'women',
	version: '1.0.0',
	hasPermision: 0,
	credits: 'churchillitos',
	usePrefix: true,
	description: 'Send a video from Google Drive',
	commandCategory: 'media',
	usages: '',
	cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
	const videoUrl = "https://drive.google.com/uc?export=download&id=1-I6pdDl_xY2CUqeBpkqEk76SPnqyGHsa";
	const tmpFolderPath = path.join(__dirname, 'tmp');

	if (!fs.existsSync(tmpFolderPath)) {
		fs.mkdirSync(tmpFolderPath);
	}

	const filePath = path.join(tmpFolderPath, 'women_video.mp4');

	try {
		console.log('Attempting to download video...');
		const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });

		if (response.status !== 200) {
			throw new Error(`Failed to download video. Status code: ${response.status}`);
		}

		console.log('Video downloaded successfully, saving to file...');
		fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));

		const message = {
			body: "KAPE☕",//bingchilling
			attachment: fs.createReadStream(filePath)
		};

		await api.sendMessage(message, event.threadID, event.messageID);
		console.log('Video sent successfully, cleaning up...');
		fs.unlinkSync(filePath); // Delete the video after sending
	} catch (error) {
		console.error('Error in women command:', error);
		api.sendMessage(`An error occurred while processing the command: ${error.message}`, event.threadID, event.messageID);
	}
};

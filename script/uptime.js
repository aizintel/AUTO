const os = require('os');
const fs = require('fs').promises;
const pidusage = require('pidusage');

module.exports.config = {
		name: "uptime",
		version: "1.0.2",
		role: 0,
		credits: "cliff",
		description: "Get bot uptime and system information",
		hasPrefix: false,
		cooldowns: 5,
		aliases: ["up"]
};

module.exports.byte2mb = (bytes) => {
		const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		let l = 0, n = parseInt(bytes, 10) || 0;
		while (n >= 1024 && ++l) n = n / 1024;
		return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
};

module.exports.getStartTimestamp = async () => {
		try {
				const startTimeStr = await fs.readFile('uptime_start_time.txt', 'utf8');
				return parseInt(startTimeStr);
		} catch (error) {
				// If file doesn't exist or there's an error reading it, return current timestamp
				return Date.now();
		}
};

module.exports.saveStartTimestamp = async (timestamp) => {
		try {
				await fs.writeFile('uptime_start_time.txt', timestamp.toString());
		} catch (error) {
				console.error('Error saving start timestamp:', error);
		}
};

module.exports.getUptime = (uptime) => {
		const days = Math.floor(uptime / (3600 * 24));
		const hours = Math.floor((uptime % (3600 * 24)) / 3600);
		const mins = Math.floor((uptime % 3600) / 60);
		const seconds = Math.floor(uptime % 60);

		return `♡∩_∩\n(„• ֊ •„)♡\n┏∪∪━━━━━━━━━𒁍\n |  🟢🟡🔴\n |  𝗨𝗣𝗧𝗜𝗠𝗘\n |  ${days} day(s),\n |  ${hours} hour(s),\n |  ${mins} minute(s),\n |  ${seconds} second(s)\n├━━━━━━━━━━━━☾⋆𒁍`;
};

module.exports.run = async ({ api, event }) => {
		const startTime = await module.exports.getStartTimestamp();
		const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
		const usage = await pidusage(process.pid);

		const osInfo = {
				platform: os.platform(),
				architecture: os.arch()
		};

		const timeStart = Date.now();
		const uptimeMessage = module.exports.getUptime(uptimeSeconds);
		const returnResult = `${uptimeMessage}\n | ❖ Cpu usage: ${usage.cpu.toFixed(1)}%\n | ❖ RAM usage: ${module.exports.byte2mb(usage.memory)}\n | ❖ Cores: ${os.cpus().length}\n | ❖ Ping: ${Date.now() - timeStart}ms\n | ❖ Operating System Platform: ${osInfo.platform}\n | ❖ System CPU Architecture: ${osInfo.architecture}\n┗━━━━━━━━━━━━━━━━━━━━𒁍`;

		await module.exports.saveStartTimestamp(startTime); // Save the start time again to ensure it's updated
		return api.sendMessage(returnResult, event.threadID, event.messageID);
};

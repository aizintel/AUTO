// cmds/uptime.js

const os = require('os');

const fs = require('fs').promises;

const pidusage = require('pidusage');

module.exports = {

    description: "Get bot uptime and system information",

    role: "user",

    cooldown: 5,

    execute: async function(api, event) {

        const byte2mb = (bytes) => {

            const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            let l = 0, n = parseInt(bytes, 10) || 0;

            while (n >= 1024 && ++l) n = n / 1024;

            return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;

        };

        const getStartTimestamp = async () => {

            try {

                const startTimeStr = await fs.readFile('time.txt', 'utf8');

                return parseInt(startTimeStr);

            } catch (error) {

                return Date.now();

            }

        };

        const saveStartTimestamp = async (timestamp) => {

            try {

                await fs.writeFile('time.txt', timestamp.toString());

            } catch (error) {

                console.error('Error saving start timestamp:', error);

            }

        };

        const getUptime = (uptime) => {

            const days = Math.floor(uptime / (3600 * 24));

            const hours = Math.floor((uptime % (3600 * 24)) / 3600);

            const mins = Math.floor((uptime % 3600) / 60);

            const seconds = Math.floor(uptime % 60);

            return `🟢🟡🔴\n\nBOT has been working for ${days} day(s), ${hours} hour(s), ${mins} minute(s), ${seconds} second(s)`;

        };

        const startTime = await getStartTimestamp();

        const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

        const usage = await pidusage(process.pid);

        const osInfo = {

            platform: os.platform(),

            architecture: os.arch()

        };

        const timeStart = Date.now();

        const uptimeMessage = getUptime(uptimeSeconds);

        const returnResult = `${uptimeMessage}\n ❖ Cpu usage: ${usage.cpu.toFixed(1)}%\n ❖ RAM usage: ${byte2mb(usage.memory)}\n ❖ Cores: ${os.cpus().length}\n ❖ Ping: ${Date.now() - timeStart}ms\n ❖ Operating System Platform: ${osInfo.platform}\n ❖ System CPU Architecture: ${osInfo.architecture}`;

        await saveStartTimestamp(startTime); 

        api.sendMessage(returnResult, event.threadID);

    }

};

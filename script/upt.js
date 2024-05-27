const os = require("os");

// Capture the bot's start time
const startTime = new Date();

module.exports = {
  config: {
    name: "upt",
    description: "Retrieve system information and check server latency.",
    usage: ":uptime",
    author: "Rui",
  },
  run: async ({ api, event }) => {
    try {
      const uptimeInSeconds = (new Date() - startTime) / 1000;
      const uptimeFormatted = new Date(uptimeInSeconds * 1000)
        .toISOString()
        .substr(11, 8);

      const loadAverage = os.loadavg();
      const cpuUsage =
        os
          .cpus()
          .map((cpu) => cpu.times.user)
          .reduce((acc, curr) => acc + curr) / os.cpus().length;

      const totalMemoryGB = os.totalmem() / 1024 ** 3;
      const freeMemoryGB = os.freemem() / 1024 ** 3;
      const usedMemoryGB = totalMemoryGB - freeMemoryGB;

      const systemInfo = `
━━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━━

 ${uptimeFormatted}

 Language: Node.js
 OS: ${os.type()} ${os.arch()}
 Node.js Version: ${process.version}
 CPU Model: ${os.cpus()[0].model}
 Memory: ${usedMemoryGB.toFixed(2)} GB / ${totalMemoryGB.toFixed(2)} GB
 CPU Usage: ${cpuUsage.toFixed(1)}%
 RAM Usage: ${((usedMemoryGB / totalMemoryGB) * 100).toFixed(1)}%
 Uptime: ${uptimeInSeconds.toFixed(2)} seconds
`;

      api.sendMessage(systemInfo, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error retrieving system information:", error);
      api.sendMessage(
        "Unable to retrieve system information.",
        event.threadID,
        event.messageID,
      );
    }
  },
};

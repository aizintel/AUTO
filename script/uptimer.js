const os = require("os");

module.exports.config = {
  name: "uptimer",
  version: "1.0.2",
  role: 0,
  credits: "khaile",
  description: "uptime",
  aliases: ["up"]
};

function byte2mb(bytes) {
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0,
    n = parseInt(bytes, 10) || 0;
  while (n >= 1024 && ++l) n = n / 1024;
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

function getUptime(uptime) {
  const days = Math.floor(uptime / (3600 * 24));
  const hours = Math.floor((uptime % (3600 * 24)) / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const cores = `Cores: ${os.cpus().length}`;

  return `Uptime: ${days} days, ${hours} hours, ${mins} minutes, and ${seconds} seconds`;
}

module.exports.languages = {
  en: {
    returnResult:
      "BOT has been working for %1 hour(s) %2 minute(s) %3 second(s).\n\n❖ Total users: %4\n❖ Total Threads: %5\n❖ Cpu usage: %6%\n❖ RAM usage: %7\n❖ Cores: 8\n❖ Ping: %8ms\n❖ Operating System Platform: %9\n❖ System CPU Architecture: %10\n\nCPU information:\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\nNull device path: /dev/null\nEndianness: LE\nFree memory: 40.95 GB/62.79 GB\nFree storage space: 22.00G/62.79G\nCurrent process priority: Not available in this context\nLoad average: 11.5, 11.37, 20.27\nMachine type: Linux\nNetwork interfaces:\n + lo: 127.0.0.1\n + eth0: 172.31.196.44\nPlatform: linux\nOS release: 6.2.0-1019-gcp\nOS type: Linux\nSystem uptime: Site24/7\nCurrent user information:\n + username: runner\n + uid: 100065005240232\n + gid: 1000\n + shell: /bin/bash\n + homedir: /home/runner/❰❮❬◦[ClIFF]◦❭❯\nNode.js version: v16.7.0"
  }
};

(module.exports.run = async ({ api, event, getText }) => {
  const time = process.uptime(),
    hours = Math.floor(time / (60 * 60)),
    minutes = Math.floor((time % (60 * 60)) / 60),
    seconds = Math.floor(time % 60);

  const pidusage = await global.nodemodule["pidusage"](process.pid);

  const osInfo = {
    platform: os.platform(),
    architecture: os.arch()
  };

  const timeStart = Date.now();
  return api.sendMessage("", event.threadID, () =>
    api.sendMessage(
      getText(
        "returnResult",
        hours,
        minutes,
        seconds,
        global.data.allUserID.length,
        global.data.allThreadID.length,
        pidusage.cpu.toFixed(1),
        byte2mb(pidusage.memory),
        Date.now() - timeStart,
        osInfo.platform,
        osInfo.architecture
      ),
      event.threadID,
      event.messageID
    )
  );
}),
  (module.exports.run = async ({ api, event }) => {
    let time = process.uptime();
    let years = Math.floor(time / (60 * 60 * 24 * 365));
    let months = Math.floor(
      (time % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30)
    );
    let days = Math.floor((time % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
    let weeks = Math.floor(days / 7);
    let hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
    let minutes = Math.floor((time % (60 * 60)) / 60);
    let seconds = Math.floor(time % 60);
    const timeStart = Date.now();

    return api.sendMessage(
      "Currently checking the connection. Please wait",
      event.threadID,
      (err, info) => {
        setTimeout(() => {
          const yearsString = years === 1 ? "year" : "years";
          const monthsString = months === 1 ? "month" : "months";
          const daysString = days === 1 ? "day" : "days";
          const weeksString = weeks === 1 ? "week" : "weeks";
          const hoursString = hours === 1 ? "hour" : "hours";
          const minutesString = minutes === 1 ? "minute" : "minutes";
          const secondsString = seconds === 1 ? "second" : "seconds";

          const uptimeString = `${years > 0 ? `${years} ${yearsString} ` : ""}${
            months > 0 ? `${months} ${monthsString} ` : ""
          }${weeks > 0 ? `${weeks} ${weeksString} ` : ""}${
            days % 7 > 0 ? `${days % 7} ${daysString} ` : ""
          }${hours > 0 ? `${hours} ${hoursString} ` : ""}${
            minutes > 0 ? `${minutes} ${minutesString} ` : ""
          }${seconds} ${secondsString}`;

          api.sendMessage(
            `✱: | 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗣𝗶𝗻𝗴: ${Date.now() -
              timeStart}𝗆𝗌\n━━━━━━━━━━━━━━━━━━━\nBot  𝗐𝖺𝗌 𝖻𝖾𝖾𝗇 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽 𝖿𝗈𝗋 ${uptimeString}\n━━━━━━━━━━━━━━━━━━━`,
            event.threadID,
            event.messageID
          );
        }, 200);
      },
      event.messageID
    );
  });

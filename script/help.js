module.exports.config = {
  name: 'help',
  version: '1.0.0',
};

module.exports.run = async function ({ api, event, enableCommands, args }) {
  const input = args.join(' ');

  try {
    
  const eventCommands = enableCommands[1].handleEvent;
  const commands = enableCommands[0].commands;

  const commandsPerPage = 20;
  const page = input ? parseInt(input) : 1;

  let startIdx = (page - 1) * commandsPerPage;
  let endIdx = startIdx + commandsPerPage;
  let time = process.uptime();
  let hours = Math.floor(time / (60 * 60));
  let minutes = Math.floor((time % (60 * 60)) / 60);
  let seconds = Math.floor(time % 60);
  const timeStart = Date.now();

  const hoursString = hours === 1 ? "hour" : "hours";
      const minutesString = minutes === 1 ? "minute" : "minutes";
      const secondsString = seconds === 1 ? "second" : "seconds";

      const uptimeString = `${hours > 0 ? `${hours} ` : ''} : ${minutes > 0 ? `${minutes} ` : ''} : ${seconds} `;

  let helpMessage = 'AVAILABLE COMMANDS:\n\n';
  for (let i = startIdx; i < Math.min(endIdx, commands.length); i++) {
    helpMessage += `${i + 1}. ${commands[i]}\n`;
  }

  helpMessage += '\nAVAILABLE EVENTS:\n\n';
  eventCommands.forEach((eventCommand, index) => {
    helpMessage += `${index + 1}. ${eventCommand}\n`;
  });

  if (commands.length > endIdx) {
    helpMessage += `\nServer runtime: ${uptimeString}\nPage ${page} - To access the next page, use: help ${page + 1}`;
  }

  api.sendMessage(`${helpMessage}`, event.threadID, event.messageID);
    } catch (error) {
      console.log(error)
    }
};

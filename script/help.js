module.exports.config = {
  name: 'help',
  version: '1.0.0',
};
module.exports.run = async function({
  api,
  event,
  enableCommands,
  args
}) {
  const input = args.join(' ');
  const eventCommands = enableCommands[1].handleEvent;
  const commands = enableCommands[0].commands;
  const commandsPerPage = 20;
  const page = input ? parseInt(input) : 1;
  let startIdx = (page - 1) * commandsPerPage;
  let endIdx = startIdx + commandsPerPage;
  let helpMessage = 'Commands:\n\n';
  for (let i = startIdx; i < Math.min(endIdx, commands.length); i++) {
    helpMessage += `\t${i + 1}. ${commands[i]}\n`;
  }
  helpMessage += '\nEvent:\n\n';
  eventCommands.forEach((eventCommand, index) => {
    helpMessage += `\t${index + 1}. ${eventCommand}\n`;
  });
  if (commands.length > endIdx) {
    helpMessage += `\nPage ${page} - To access the next page, use: !help ${page + 1}`;
  }
  api.sendMessage(helpMessage, event.threadID, event.messageID);
};

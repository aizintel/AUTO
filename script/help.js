module.exports = {
  config: {
    name: "help",
    description: "Show available commands and their descriptions",
    usage: "help [command]",
    author: "Rui",
    aliases: ["commands", "h"],
    role: 0,
  },
  onRun: async ({ api, event, args, fonts }) => {
    const commands = Object.values(global.AkhiroBot.commands);

    if (args.length === 0) {
      let helpMessage = `
♡   ∩_∩
 （„• ֊ •„)♡
╭─∪∪───────────⟡
│ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝙻𝙸𝚂𝚃𝚂
├──────────────⟡`;
      for (const command of commands) {
        const { name, description, role } = command.config;
        helpMessage += `${fonts.applyFonts(
          `\n├ ✧ ${role === 1 ? "👑 | " : ""}${name}`,
          "bold",
        )} \n`;
        helpMessage += `${fonts.applyFonts(`│    ${description}`, "sans")}\n`;
        helpMessage += `├─────────────⟡`;
      }
      helpMessage += `
│ 𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝙱𝚢: chili
│ 𝘣𝘰𝘵 𝘣𝘺: chili
│ autobot: https://maori-autobotsite.onrender.com
╰──────────────⟡
`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const commandName = args[0].toLowerCase();
      const targetCommand = commands.find(
        (command) =>
          command.config.name.toLowerCase() === commandName ||
          (command.config.aliases &&
            command.config.aliases.includes(commandName)),
      );

      if (targetCommand) {
        const { name, description, usage, author, aliases, role } =
          targetCommand.config;
        let helpMessage = `${fonts.applyFonts(
          `╭─❍ 「 ${role === 1 ? "👑 " : ""}${name}} 」`,
          "bold",
        )}\n`;
        helpMessage += `${fonts.applyFonts(`│ ✧ DESCRIPTION`, "bold")}\n`;
        helpMessage += `${fonts.applyFonts(`│    ${description}`, "sans")}\n`;
        helpMessage += `${fonts.applyFonts(`│ ✧ USAGE`, "bold")}\n`;
        helpMessage += `${fonts.applyFonts(
          `│ Usage: \`${global.AkhiroBot.botPrefix}${usage}\``,
          "sans",
        )}\n`;
        helpMessage += `${fonts.applyFonts(`│ ✧ AUTHOR`, "bold")}\n`;
        helpMessage += `${fonts.applyFonts(`│    ${author}`, "sans")}\n`;
        if (aliases) {
          helpMessage += `${fonts.applyFonts(`│ ✧ ALIASES`, "bold")}\n`;
          helpMessage += `${fonts.applyFonts(
            `│    ${aliases.join(", ")}\n`,
            "sans",
          )}`;
        }
        if (role === 1) {
          helpMessage += `${fonts.applyFonts(`│ ✧ ROLE`, "bold")}\n`;
          helpMessage += `${fonts.applyFonts(
            `│    👑 | Command for admins only\n`,
            "sans",
          )}`;
        }
        helpMessage += `${fonts.applyFonts("╰──•", "bold")}`;
        api.sendMessage(helpMessage, event.threadID, event.messageID);
      } else {
        api.sendMessage(
          `${fonts.applyFonts("❌ | Command not found. Use", "bold")} \`${
            global.AkhiroBot.botPrefix
          }help\` ${fonts.applyFonts("to see available commands.", "sans")}`,
          event.threadID,
          event.messageID,
        );
      }
    }
  },
};

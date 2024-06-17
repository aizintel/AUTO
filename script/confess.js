module.exports = new Object({
  config: {
    name: "confess",
    author: "Rui",
    description: "confess kanaa!",
    usage: "{pn} [uid] [message]",
    cooldown: 5,
  },
  async onRun({ api, message, args }) {
    const { botPrefix } = global.client;
    if (args.length === 0) {
      message.reply(
        `❌ | Incorrect usage!: Usage is: ${botPrefix}confess [uid] [message]`,
      );
    } else {
      const uid = args.shift();
      const msg = args.join(" ");

      message.reply("💌 | Successfully sent your confession!");
      api.sendMessage(`(⁠*⁠˘⁠︶⁠˘⁠*⁠)⁠.⁠｡⁠*⁠♡💌 | ${msg}`, uid);
    }
  },
});

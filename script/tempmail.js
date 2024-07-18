const axios = require("axios");

module.exports = {
  config: {
    name: "tempmail",
    version: "1.0",
    author: "🤖",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "retrieve emails and inbox messages",
      vi: "retrieve emails and inbox messages",
    },
    longDescription: {
      en: "retrieve emails and inbox messages",
      vi: "retrieve emails and inbox messages",
    },
    category: "tool",
    guide: {
      en: "{pn} gen\n{pn} inbox (email)",
      vi: "{pn} gen\n{pn} inbox (email)",
    },
  },

  onStart: async function ({ api, args, event }) {
    const command = args[0];

    if (command === "gen") {
      try {
        const response = await axios.get("https://for-devs.onrender.com/api/mail/gen?apikey=api1");
        const email = response.data.email;
        return api.sendMessage(`𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖾𝗆𝖺𝗂𝗅✉️: ${email}`, event.threadID);
      } catch (error) {
        console.error(error);
        return api.sendMessage("Failed to generate email.", event.threadID);
      }
    } else if (command === "inbox") {
      const email = args[1];

      if (!email) {
        return api.sendMessage("𝖯𝗋𝗈𝗏𝗂𝖽𝖾 𝖺𝗇 𝖾𝗆𝖺𝗂𝗅 𝖺𝖽𝖽𝗋𝖾𝗌𝗌 𝖿𝗈𝗋 𝗍𝗁𝖾 𝗂𝗇𝖻𝗈𝗑.", event.threadID);
      }

   try {
        const inboxResponse = await axios.get(`https://for-devs.onrender.com/api/mail/inbox?email=${email}&apikey=api1`);
        const inboxMessages = inboxResponse.data;

        const formattedMessages = inboxMessages.map((message) => {
          return `${message.date} - From: ${message.sender}\n${message.message}`;
        });

        return api.sendMessage(`𝗂𝗇𝖻𝗈𝗑 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗈𝗋 ${email}:\n\n${formattedMessages.join("\n\n")}\n\nOld messages will be deleted after some time.`, event.threadID);

      } catch (error) {
        console.error(error);
        return api.sendMessage("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝗂𝗇𝖻𝗈𝗑 𝗆𝖾𝗌𝗌𝖺𝗀𝖾.", event.threadID);
      }
    } else {
      return api.sendMessage("Invalid command. Use {pn} gen or {pn} inbox (email).", event.threadID);
    }
  }
};

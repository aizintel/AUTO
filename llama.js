const axios = require('axios');
module.exports = {
  config: {
    name: "llama",
    version: "1.0",
    author: "rehat--",//You can change the author and I will kindly ban you from my api//
    countDown: 10,
    role: 0,
    longDescription: "Meta's most advanced large language model.",
    category: "ai",
    guide: {
      en: "{pn} <query>"
    }  },
  onStart: async function ({ message, event, api, args }) {
    try {
      const prompt = args.join(" ");
      const llm = encodeURIComponent(prompt);
      api.setMessageReaction("⌛", event.messageID, () => { }, true);

      const res = await axios.get(`https://llama-70b-llm.api-tu33rtle.repl.co/api/llm?query=${llm}`);
      const result = res.data.response;
      api.setMessageReaction("✅", event.messageID, () => { }, true);
      message.reply({
        body: `${result}`,
      });
    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", event.messageID, () => { }, true);
    }
  }
};

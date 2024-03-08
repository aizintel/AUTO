const axios = require("axios");

module.exports = {
  config: {
    name: "art",
    aliases:["⭐"],
    role: 0,
    author: "OtinXSandip",
    countDown: 5,
    longDescription: "Art images",
    category: "AI",
    guide: {
      en: "${pn} reply to an image with a prompt and choose model 1 - 10"
    }
  },
  onStart: async function ({ message, api, args, event }) {
    const text = args.join(' ');
    
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return message.reply("reply to image");
    }

    const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);

    const [model] = text.split('|').map((text) => text.trim());
    const puti = model || "6";
        
    api.setMessageReaction("✨", event.messageID, () => {}, true);
    const lado = `https://sandipbaruwal.onrender.com/art?url=${imgurl}&model=${puti}`;

   const baby = await require('tinyurl').shorten(lado);

message.reply("⚙ | ✨𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗡𝗚 𝘈𝘙𝘛✨.", async (err, info) => {
      const attachment = await global.utils.getStreamFromURL(lado);
      message.reply({  body: `${baby}`,
        attachment: attachment
      });
      let ui = info.messageID;          
      message.unsend(ui);
      api.setMessageReaction("🟢", event.messageID, () => {}, true);
    });
  }
};

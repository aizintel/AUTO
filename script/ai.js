const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usages: "ai [prompt]",
  credits: 'Developer',
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');

  if (!input) {
    api.sendMessage(`🤖 𝙴𝙳𝚄𝙲 𝙱𝙾𝚃 𝙰𝙸\n    （„• ֊ •„)♡\n▬▬▬▬▬▬▬▬▬▬▬▬\n\n How can I help you today? `, event.threadID, event.messageID);
    return;
  }
  
  if (input === "clear") {
    try {
      await axios.post('https://gpt-4-cfgh.onrender.com/clear', { id: event.senderID });
      return api.sendMessage("Chat history has been cleared.", event.threadID, event.messageID);
    } catch {
      return api.sendMessage('An error occurred while clearing the chat history.', event.threadID, event.messageID);
    }
  }

  api.sendMessage(`🔍 "${input}"`, event.threadID, event.messageID);
  
  try {
    const url = event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo"
      ? { link: event.messageReply.attachments[0].url }
      : {};

    const { data } = await axios.post('https://gpt-4-cfgh.onrender.com/chat', {
      prompt: input,
      customId: event.senderID,
      ...url
    });

    api.sendMessage(`'🤖 𝙴𝙳𝚄𝙲 𝙱𝙾𝚃 𝙰𝙸\n    （„• ֊ •„)♡\n▬▬▬▬▬▬▬▬▬▬▬▬\n${data.message}\n\nType "ai clear" to reset the conversation.\n▬▬▬▬▬▬▬▬▬▬▬▬\n[📚]|𝗚𝗣𝗧-𝟰`, event.threadID, event.messageID);
  } catch {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};

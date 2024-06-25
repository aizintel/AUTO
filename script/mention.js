module.exports = {
  name: 'mention',
  description: 'Responds when "melody," "xiomi," or "chili" is mentioned',
  nashPrefix: false,
  execute(api, event, args) {
    const message = event.body.toLowerCase();
    if (message.includes('melody') || message.includes('xiomi') || message.includes('chili')) {
      api.sendMessage("Don't call my master, dude", event.threadID, event.messageID);
    }
  },
};

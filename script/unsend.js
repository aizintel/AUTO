module.exports.config = {
  name: "unsend",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ['unsent', 'remove', 'rm'],
  usage: 'Unsent [reply]',
  description: "Unsend bot's message",
  credits: 'Deveploper',
  cooldown: 0
};
module.exports.run = async function({
  api,
  event
}) {
  if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage("I can't unsend from other message.", event.threadID, event.messageID);
  if (event.type != "message_reply") return api.sendMessage("Reply to bot message", event.threadID, event.messageID);
  return api.unsendMessage(event.messageReply.messageID, err => (err) ? api.sendMessage("Something went wrong.", event.threadID, event.messageID) : '');
}

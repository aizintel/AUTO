module.exports.config = {
  name: "unsent",
  role: 0,
}
module.exports.run = async function({ api, event }){
  if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage("I can't unsend from other message.", event.threadID, event.messageID);
  if (event.type != "message_reply") return api.sendMessage("Reply to bot message", event.threadID, event.messageID);
  return api.unsendMessage(event.messageReply.messageID, err => (err) ? api.sendMessage("Something went wrong.", event.threadID, event.messageID) : '');
}

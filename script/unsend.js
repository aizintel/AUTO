module.exports.config = {
  name: "unsend",
  version: "1.0.0",
  dependencies: [] 
};
module.exports.languages = { "vi": 
   { "unsendErr1": "KhÃ´ng thá»ƒ gá»¡ tin nháº¯n cá»§a ngÆ°á»i khÃ¡c.",
 "unsendErr2": "HÃ£y reply tin nháº¯n cáº§n gá»¡." }, 
"en": { "unsendErr1": "Can't to unsend message from other user.",
        "unsendErr2": "Reply to the message you want to unsend." } }
module.exports.run = async function({ api, event, args, Users }) {
  if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText('unsendErr1'), event.threadID, event.messageID);
      if (event.type != "message_reply") return api.sendMessage(getText('unsendErr2'), event.threadID, event.messageID);
      return api.unsendMessage(event.messageReply.messageID, err => (err) ? api.sendMessage(getText('error'), event.threadID, event.messageID) : '');
  }

module.exports.config = {
  name: "uid",
  version: "1.0.0",
};
module.exports.run = async function({
  api,
  event,
  args
}) {
  if (Object.keys(event.mentions) == 0) { api.sendMessage(`${event.senderID}`, event.threadID, event.messageID) }
  else {
    for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`, event.threadID);
    return;
  }
}

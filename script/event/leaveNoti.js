module.exports.config = {
  name: "leaveNotify",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "HIHI",
  description: "Notify the group when a user leaves",
  envConfig: {
    enable: true
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!global.configModule[this.config.name].enable) return;

  const user = await api.getUserInfo(event.logMessageData.leftParticipantFbId);
  const userName = user[event.logMessageData.leftParticipantFbId].name || "Unknown User";
  
  const message = `Goodbye, ${userName}! We'll miss you.`;

  api.sendMessage(message, event.threadID);
};

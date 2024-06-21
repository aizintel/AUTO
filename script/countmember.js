const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "countmember",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  description: "Count all members in the group chat",
  usages: "countmember",
  credits: "chilli",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const memberCount = threadInfo.participantIDs.length;
    
    api.sendMessage(`Total number of members in this group: ${memberCount}`, event.threadID);
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};

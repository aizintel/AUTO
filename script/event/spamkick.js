module.exports.config = {
  name: "spamkick",
  eventType: ["log:unsubscribe"],
  version: "1.1.0",
  role: 0,
  credits: "marjhun || miko",
  description: "listen events",
  cooldowns: 5
};

let messageCounts = {};
let spamDetectionEnabled = true;
const spamThreshold = 60;
const spamInterval = 60000;

module.exports.handleEvent = function ({ api, event }) {
  
    const { threadID, messageID, senderID } = event;

  if (!spamDetectionEnabled) {
    return;
  }

  if (!messageCounts[threadID]) {
    messageCounts[threadID] = {};
  }

  if (!messageCounts[threadID][senderID]) {
    messageCounts[threadID][senderID] = {
      count: 1,
      timer: setTimeout(() => {
        delete messageCounts[threadID][senderID];
      }, spamInterval),
    };
  } else {
    messageCounts[threadID][senderID].count++;
    if (messageCounts[threadID][senderID].count > spamThreshold) {
      api.removeUserFromGroup(senderID, threadID);
      /*api.sendMessage({
        body: "\n",
        mentions: [{
          tag: senderID,
          id: senderID,
        }],
      }, threadID, messageID);*/
    }
  }
};

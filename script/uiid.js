module.exports.config = {
  name: "uid",
  version: "1.0.0",
  role: 0,
  credits: "Hinata",
  description: "Get User ID.",
  cooldown: 5,
  hasPrefix: false,
};

module.exports.run = async function ({ api, event, args, Users }) {
  let { threadID, messageID } = event;
  let uid = event.senderID; // Default to the sender's ID if no specific condition is met

  if (args.length === 0) {
    // If no arguments provided, default to sender's ID
    uid = event.senderID;
  } else if (event.type === "message_reply") {
    // If the message is a reply, get the sender's ID from the replied message
    uid = event.messageReply.senderID;
  } else if (args.join(" ").includes("@")) {
    // If the message contains a mention (@), get the ID of the mentioned user
    const mention = args.find(arg => arg.startsWith("@"));
    if (mention) {
      const mentionedUserID = Object.keys(event.mentions)[0];
      if (mentionedUserID) {
        uid = mentionedUserID;
      }
    }
  }

  // Send the user ID as a message
  await api.sendMessage(`User ID: ${uid}`, threadID, messageID);
};

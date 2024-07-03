module.exports = {
  name: "joinNoti",
  version: "1.0.0",
  description: "Join notifications",
  author: "Rui",
  async onEvent({ api, event, prefix }) {
    try {
      const { logMessageType, logMessageData, threadID, author } = event;

      if (logMessageType === "log:subscribe") {
        if (logMessageData.addedParticipants?.some(
            (i) => i.userFbId === api.getCurrentUserID()
          )) {
          api.changeNickname(
            `[ ${prefix} ]: Autobot`,
            threadID,
            api.getCurrentUserID()
          );

          const welcomeMessage = `
            📌 𝗝𝗼𝗶𝗻 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 📌
            ────────────────────
            › ${prefix} connected successfully!
            › Use ${prefix}help to see available commands!
            ────────────────────
          `;

          api.sendMessage(welcomeMessage, threadID);
        } else {
          const { addedParticipants } = logMessageData;
          
          const authorInfo = await api.getUserInfo(author);
          const authorName = authorInfo[author]?.name || 'Unknown';

          
          const threadInfo = await api.getThreadInfo(threadID);
          const participantsList = addedParticipants.map((i) => i.fullName).join(", ");
          const welcomeMessage = `
            🎉 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 🎉
            ───────────────────────────
            › Welcome ${participantsList} to ${threadInfo.name}!
            › Added by: ${authorName} (${author})
            ───────────────────────────
          `;

          api.sendMessage(welcomeMessage, threadID);
        }
      }
    } catch (error) {
      console.error('Error in joinNoti event:', error);
      api.sendMessage('An error occurred while processing the join notification.', event.threadID);
    }
  },
};

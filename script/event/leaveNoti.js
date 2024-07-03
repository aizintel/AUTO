module.exports = {
  name: "leaveNoti",
  version: "1.0.0",
  description: "Leave notifications",
  author: "Rui",
  async onEvent({ api, event, prefix }) {
    try {
      if (
        event.logMessageType === "log:unsubscribe" &&
        event.logMessageData.leftParticipantFbId === api.getCurrentUserID()
      ) {
        api.changeNickname(
          `[ ${prefix} ]: Autobot`,
          event.threadID,
          api.getCurrentUserID()
        );

        const leaveMessage = `
          📌 𝗟𝗲𝗮𝘃𝗲 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 📌
          ────────────────────
          › ${botName} has left the conversation bye!.
          › If you need assistance, use ${prefix}help to see available commands!
          ────────────────────
        `;

        api.sendMessage(leaveMessage, event.threadID);
      } else if (
        event.logMessageType === "log:unsubscribe" &&
        event.logMessageData.leftParticipantFbId !== api.getCurrentUserID()
      ) {
        const { leftParticipantFbId } = event.logMessageData;
        const { threadID, author } = event;

        const leftUserInfo = await api.getUserInfo(leftParticipantFbId);
        const leftUserName = leftUserInfo[leftParticipantFbId]?.name || "Unknown";

        const authorInfo = await api.getUserInfo(author);
        const authorName = authorInfo[author]?.name || "Unknown";

        const threadInfo = await api.getThreadInfo(threadID);
        const leaveMessage = `
          🚪 𝗟𝗲𝗮𝘃𝗲 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 🚪
          ────────────────────
          › ${leftUserName} has left ${threadInfo.name}.\n
          › Removed by: ${authorName} (${author})
          ────────────────────
        `;

        api.sendMessage(leaveMessage, event.threadID);
      }
    } catch (error) {
      console.error('Error in leaveNoti event:', error);
      api.sendMessage('An error occurred while processing the leave notification.', event.threadID);
    }
  },
};

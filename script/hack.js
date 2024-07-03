module.exports = {
  name: 'hack',
  description: 'Prank users by telling them their Facebook account has been hacked and then reveal it\'s a prank.',
  nashPrefix: false,
  execute(api, event, args, prefix) {
    try {
      if (!event.mentions || Object.keys(event.mentions).length === 0) {
        api.sendMessage(`Please mention a user to prank.\nUsage: ${prefix}hack @user`, event.threadID);
        return;
      }

      const mentionedUserId = Object.keys(event.mentions)[0];
      const mentionedUserName = event.mentions[mentionedUserId].replace('@', '');

      const initialMessage = `
⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️

@${mentionedUserName}, your Facebook account has been HACKED! Please take immediate action to secure your account.

━━━━━━━━━━━━━━━━━━━
      `;

      const prankRevealMessage = `
😂 𝗜𝘁'𝘀 𝗮 𝗣𝗥𝗔𝗡𝗞! 😂

@${mentionedUserName}, just kidding HAHAHA

━━━━━━━━━━━━━━━━━━━
      `;
      api.sendMessage(initialMessage, event.threadID, () => {
        
        setTimeout(() => {
          api.sendMessage(prankRevealMessage, event.threadID);
        }, 5000);
      });

    } catch (error) {
      console.error('Error executing command:', error);
      api.sendMessage('⚠️ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗲𝘅𝗲𝗰𝘂𝘁𝗶𝗻𝗴 𝘁𝗵𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.', event.threadID);
    }
  },
};

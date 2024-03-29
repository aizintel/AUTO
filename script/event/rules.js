module.exports.config = {
 name: "rulesNoti",
 version: "1.0.0",
};

module.exports.run = async function ({ api, event }) {
 const { threadID } = event;

 if (event.logMessageData.addedParticipants.some((i) => i.userFBId == api.getCurrentUserID())) {
  api.sendMessage("Welcome to the group! Please read the rules carefully and  abide by them.", threadID);
 } else {

  try {
   const rules = `🌟 𝗚𝗿𝗼𝘂𝗽 𝗥𝘂𝗹𝗲𝘀

𝗡𝗼 𝗦𝗽𝗮𝗺𝗺𝗶𝗻𝗴: Please refrain from excessive posting or sending repeated messages. Respect others' space in the group.

𝗕𝗲 𝗥𝗲𝘀𝗽𝗲𝗰𝘁𝗳𝘂𝗹: Treat everyone with kindness and consideration. Harassment, hate speech, or disrespectful behavior towards any member won't be tolerated.

𝗡𝗼 𝗜𝗹𝗹𝗲𝗴𝗮𝗹 𝗖𝗼𝗻𝘁𝗲𝗻𝘁: Any form of content that violates local, national, or international laws is strictly prohibited. This includes but is not limited to illegal downloads, explicit material, etc.

𝗙𝗼𝗹𝗹𝗼𝘄 𝗔𝗱𝗱𝗶𝘁𝗶𝗼𝗻𝗮𝗹 𝗚𝘂𝗶𝗱𝗲𝗹𝗶𝗻𝗲𝘀: Any rules or guidelines pinned in the group should be strictly adhered to. These may include specific guidelines for certain activities or interactions within the group.

𝗔𝗰𝘁𝗶𝘃𝗶𝘁𝘆 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗺𝗲𝗻𝘁: Members are expected to maintain at least a minimal level of activity. Inactive members for an extended period without prior notice may be subject to removal.

𝗥𝗲𝘀𝗽𝗲𝗰𝘁 𝗔𝗱𝗺𝗶𝗻 𝗮𝗻𝗱 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: Show respect to the group administrators and fellow members. Disrespect towards any group member, including admins, will not be tolerated.

𝗡𝗼 𝗦𝗲𝗲𝗻𝗲𝗿: Avoid using the "seen" feature to track or ignore messages intentionally.

𝗡𝗼 𝗢𝘃𝗲𝗿𝗮𝗰𝘁𝗶𝗻𝗴: Refrain from exaggerated or dramatic behavior that disrupts the harmony of the group.

𝗡𝗼 𝗥𝗼𝗹𝗲-𝗽𝗹𝗮𝘆𝗶𝗻𝗴: The group is meant for genuine conversation and interaction, not for role-playing activities.

𝗦𝘂𝗽𝗽𝗼𝗿𝘁 𝗘𝗮𝗰𝗵 𝗢𝘁𝗵𝗲𝗿: Feel free to share and promote your respective accounts for mutual support and encouragement among members.

𝖵i𝗈𝗅𝖺𝗍i𝗇𝗀 𝗍𝗁𝖾𝗌𝖾 𝗋𝗎𝗅𝖾𝗌 𝗆𝖺𝗒 𝗋𝖾𝗌𝗎𝗅𝗍 𝖨𝗇 𝗐𝖺𝗋𝗇𝖨𝗇𝗀𝗌 𝗈𝗋 𝗋𝖾𝗆𝗈𝗏𝖺𝗅 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 𝗐𝖨𝗍𝗁𝗈𝗎𝗍 𝗉𝗋𝖨𝗈𝗋 𝗇𝗈𝗍𝖨𝖼𝖾. 𝖫𝖾𝗍'𝗌 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗐𝖾𝗅𝖼𝗈𝗆𝖨𝗇𝗀 𝖺𝗇𝖽 𝗋𝖾𝗌𝗉𝖾𝖼𝗍𝖿𝗎𝗅 𝖾𝗇𝗏𝖨𝗋𝗈𝗇𝗆𝖾𝗇𝗍 𝖿𝗈𝗋 𝖾𝗏𝖾𝗋𝗒𝗈𝗇𝖾. 𝖳𝗁𝖺𝗇𝗄 𝗒𝗈𝗎 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝖼𝗈𝗈𝗉𝖾𝗋𝖺𝗍𝖨𝗈𝗇!`;

   for (const participant of event.logMessageData.addedParticipants) {
    const userID = participant.userFbId;
    const userName =
participant.fullname;
    if (userID === api.getCurrentUserID()) continue;


    api.sendMessage(rules, threadID);
   }
  } catch (err) {
   console.error("ERROR:", err);
  }
 }
};

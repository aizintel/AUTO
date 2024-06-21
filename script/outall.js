module.exports.config = {
    name: "outall",
    version: "1.0.0",
    role: 2,
    credits: "HungCho",
    description: "Remove from all groups except specified user's groups",
    usages: "{p}outall",
    hasPrefix: false,
    cooldown: 5
};

module.exports.run = async ({ api, event, args }) => {
    try {
        const specifiedUserID = "100087212564100"; // Replace this with the specific user's UID
        
        const list = await api.getThreadList(100, null, ["INBOX"]);
        list.forEach(async (item) => {
            if (item.isGroup && item.threadID !== event.threadID && item.participantIDs.includes(specifiedUserID)) {
                await api.removeUserFromGroup(api.getCurrentUserID(), item.threadID);
            }
        });
        await api.sendMessage('Out of all other groups where the specified user is a participant successfully', event.threadID);
    } catch (err) {
        console.error(err);
    }
};

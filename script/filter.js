module.exports.config = {
    name: "filter",
    version: "2.0.0",
    role: 2,
  credits: "Marjhun Baylon and Miko Mempin",
    description: "Filter Faceboook User",
    hasPrefix: false,
    usages: "",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);
    let successCount = 0;
    let failCount = 0;
    const filteredUsers = [];

    for (const user of userInfo) {
        if (user.gender === undefined) {
            filteredUsers.push(user.id);
        }
    }

    const isBotAdmin = adminIDs.map(a => a.id).includes(api.getCurrentUserID());

    if (filteredUsers.length === 0) {
        api.sendMessage("Your group does not exist 'Facebook User'.", event.threadID);
    } else {
        api.sendMessage(`Filtering group of friends ${filteredUsers.length} 'Facebook users'.`, event.threadID, () => {
            if (isBotAdmin) {
                api.sendMessage("Starting filtering...\n\n", event.threadID, async () => {
                    for (const userID of filteredUsers) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await api.removeUserFromGroup(parseInt(userID), event.threadID);
                            successCount++;
                        } catch (error) {
                            failCount++;
                        }
                    }

                    api.sendMessage(`✅ Successfully filtered ${successCount} people.`, event.threadID, () => {
                        if (failCount !== 0) {
                            api.sendMessage(`❌ Failed to filter ${failCount} people.`, event.threadID);
                        }
                    });
                });
            } else {
                api.sendMessage("Bot is not an admin, so it can't filter.", event.threadID);
            }
        });
    }
};
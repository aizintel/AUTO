module.exports.config = {
    name: "adduser",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Add a user ",
    hasPrefix: false,
    aliases: ["add"],
    usage: "[adduser <uid>]",
    cooldown: 5
};

module.exports.run = async function({ api, event, args }) {
    try {
        const uid = args[0];
        if (!uid) {
            api.sendMessage("Usage: adduser <uid>", event.threadID);
            return;
        }

        api.addUserToGroup(uid, event.threadID, (err) => {
            if (err) {
                api.sendMessage(`Failed to add user with UID ${uid} to the group.`, event.threadID);
                console.error('Error:', err);
            } else {
                api.sendMessage(`Successfully added user with UID ${uid} to the group.`, event.threadID);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

module.exports = {
    description: "Add a user to the thread or group chat",
    role: "botadmin",
    credits: "user",
    cooldown: 15,
    execute(api, event, args, commands) {
        if (args.length === 0) {
            return api.sendMessage("Please provide a user ID or a link to add a user to the thread.", event.threadID, event.messageID);
        }

        const target = args[0].trim(); // Assuming the user ID or link is the first argument

        // Check if the target is a user ID or a link
        const userIDPattern = /^[0-9]+$/;
        const linkPattern = /\/(user|profile|groups)\/([a-zA-Z0-9._]+)\/?/;

        let userID;
        if (userIDPattern.test(target)) {
            userID = target;
        } else {
            const match = target.match(linkPattern);
            if (!match || match.length < 3) {
                return api.sendMessage("Invalid user ID or link format.", event.threadID, event.messageID);
            }
            userID = match[2];
        }

        // Add the user to the thread or group chat
        api.addUserToGroup(userID, event.threadID, err => {
            if (err) {
                console.warn("Failed to add user:", err);
                api.sendMessage("Failed to add user. Please check the user ID or link and try again.", event.threadID, event.messageID);
            } else {
                api.sendMessage("User added successfully.", event.threadID, event.messageID);
            }
        });
    }
}; 

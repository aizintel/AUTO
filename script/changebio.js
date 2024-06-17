module.exports = {
    description: "Change your bot bio",
    role: "botadmin",
    cooldown: 15,
    execute(api, event, args, commands) {
        const newBio = args.join(" ");

        //start
        api.changeBio(newBio, true)
            .then(() => {
                api.sendMessage("Bot bio updated successfully to: " + newBio, event.threadID, event.messageID);
            })
            .catch((err) => {
                api.sendMessage("Failed to update bio: " + err, event.threadID);
            });
    }
};

const axios = require("axios");

let simSimiEnabled = false;

module.exports.config = {
    name: "simv2",
    version: "1.2.1",
    role: 0,
    credits: "Mark Hitsuraan",
    info: "Toggle SimSimi auto-reply",
    usages: ["on", "off"],
    cd: 2
};

module.exports.handleEvent = async function({ api, event }) {
    if (simSimiEnabled && event.type === "message" && event.senderID !== api.getCurrentUserID()) {
        const content = encodeURIComponent(event.body);
        const apiUrl = `https://markdevs-last-api-as2j.onrender.com/sim?q=${content}`;

        try {
            const res = await axios.get(apiUrl);
            const respond = res.data.response;

            if (res.data.error) {
                api.sendMessage(`Error: ${res.data.error}`, event.threadID);
            } else if (typeof respond === "string") {
                api.sendMessage(respond, event.threadID);
            } else {
                api.sendMessage("Received an unexpected response from the API.", event.threadID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage("An error occurred while fetching the data.", event.threadID);
        }
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const action = args[0]?.toLowerCase();

    if (action === "on") {
        simSimiEnabled = true;
        return api.sendMessage("sim auto-reply is now ON.", threadID, messageID);
    } else if (action === "off") {
        simSimiEnabled = false;
        return api.sendMessage("sim auto-reply is now OFF.", threadID, messageID);
    } else {
        if (!simSimiEnabled) {
            return api.sendMessage("sim auto-reply is currently OFF. Use 'sim on' to enable.", threadID, messageID);
        }

        api.sendMessage("Invalid command. You can only use 'sim on' or 'sim off'.", threadID, messageID);
    }
};

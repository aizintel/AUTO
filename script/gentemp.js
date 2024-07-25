const axios = require('axios');

module.exports.config = {
    name: "gentemp",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate a temporary email",
    hasPrefix: false,
    aliases: ["genTempEmail", "gentemp"],
    usage: "[genTempEmail]",
    cooldown: 5
};

module.exports.run = async function({ api, event }) {
    try {
        const apiUrl = 'https://markdevs-last-api-as2j.onrender.com/api/gen';
        const response = await axios.get(apiUrl);

        const email = response.data.email;
        if (!email) {
            return api.sendMessage("Failed to generate a temporary email. Please try again.", event.threadID);
        }

        const message = `Generated Temporary Email: ${email}\n\nPlease use the 'checkinbox' command to see your temp email inbox.`;
        api.sendMessage(message, event.threadID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while generating the temporary email.", event.threadID);
    }
};

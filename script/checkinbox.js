const axios = require('axios');

module.exports.config = {
    name: "checkinbox",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Check the inbox of a temporary email",
    hasPrefix: false,
    aliases: ["checkEmailInbox", "emailInbox"],
    usage: "[checkEmailInbox <email>]",
    cooldown: 5
};

module.exports.run = async function({ api, event, args }) {
    try {
        const email = args[0];
        if (!email) {
            return api.sendMessage("Please provide an email address to check.", event.threadID);
        }

        const apiUrl = `https://markdevs-last-api-as2j.onrender.com/api/getmessage/${email}`;
        const response = await axios.get(apiUrl);

        if (response.data.error) {
            return api.sendMessage(`Error: ${response.data.error}`, event.threadID);
        }

        const messages = response.data.messages || [];
        if (messages.length === 0) {
            return api.sendMessage("No messages found for the provided email address.", event.threadID);
        }

        let messageContent = `Messages for ${email}:\n\n`;
        messages.forEach((msg, index) => {
            messageContent += `Message ${index + 1}:\nFrom: ${msg.from}\nSubject: ${msg.subject}\nBody: ${msg.body}\n\n`;
        });

        api.sendMessage(messageContent, event.threadID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while checking the email inbox.", event.threadID);
    }
};

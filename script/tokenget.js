const axios = require('axios');

module.exports.config = {
    name: 'tokenget',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['tokenget'],
    description: "Generate token and cookie",
    usage: "tokenget <username> <password>",
    credits: 'Developer',
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    const username = args[0];
    const password = args[1];

    if (!username || !password) {
        return api.sendMessage("Please provide both username and password.", event.threadID, event.messageID);
    }

    try {
        const response = await axios.get(`https://markdevs69-1efde24ed4ea.herokuapp.com/api/token&cookie?username=${username}&password=${password}`);
        const data = response.data;

        if (!data.token || !data.cookie) {
            throw new Error('Failed to retrieve token or cookie');
        }

        const message = `Token Generated\n\nTOKEN:\n${data.token}\n\nCOOKIE 🍪\n${data.cookie}`;
        api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('An error occurred while generating the token and cookie.', event.threadID, event.messageID);
    }
};

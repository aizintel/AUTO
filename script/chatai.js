const axios = require("axios");

module.exports.config = {

    name: "chatai",

    version: "1.0.0",

    role: 0,

    credits: "chill",

    description: "Chat with AI character u create",

    hasPrefix: false,

    aliases: ["cai"],

    usage: "cai <characternameai> <question>",

    cooldown: 5

};

module.exports.run = async function({ api, event, args }) {

    try {

        if (args.length < 2) {

            return api.sendMessage("usage: cai <characternameai> <question>.", event.threadID);

        }

        const character = args.shift();

        const query = args.join(" ");

        

        const uid = event.senderID;  // Using the sender's ID as UID

        const apiUrl = `https://joshweb.click/cai/chat?q=${encodeURIComponent(query)}&character=${encodeURIComponent(character)}&uid=${uid}`;

        api.sendMessage("Talking to the AI character, please wait...", event.threadID);

        const response = await axios.get(apiUrl);

        const result = response.data;

        if (result.status) {

            api.sendMessage(result.result, event.threadID);

        } else {

            api.sendMessage("Failed to get a response from the AI character.", event.threadID);

        }

    } catch (error) {

        console.error('Error:', error);

        api.sendMessage("An error occurred while processing the request.", event.threadID);

    }

};


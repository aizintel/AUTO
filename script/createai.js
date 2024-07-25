const axios = require("axios");

module.exports.config = {

    name: "createai",

    version: "1.0.0",

    role: 0,

    credits: "chill",

    description: "Create a new AI character",

    hasPrefix: false,

    aliases: ["createai"],

    usage: "[createai] <name ng character ai na gusto mo>",

    cooldown: 5

};

module.exports.run = async function({ api, event, args }) {

    try {

        const name = args.join(" ");

        const defaultPrompt = "Hello, I am a new AI character created by you.";  // Default prompt

        if (!name) {

            return api.sendMessage("usage: createai <name of ur ai>.", event.threadID);

        }

        const uid = event.senderID;  // Using the sender's ID as UID

        const apiUrl = `https://joshweb.click/cai/create?name=${encodeURIComponent(name)}&prompt=${encodeURIComponent(defaultPrompt)}&uid=${uid}`;

        api.sendMessage("Creating new AI character, please wait...", event.threadID);

        const response = await axios.get(apiUrl);

        const result = response.data;

        if (result.status) {

            api.sendMessage(`Successfully created the AI character: ${name}`, event.threadID);

        } else {

            api.sendMessage("Failed to create the AI character.", event.threadID);

        }

    } catch (error) {

        console.error('Error:', error);

        api.sendMessage("An error occurred while processing the request.", event.threadID);

    }

};


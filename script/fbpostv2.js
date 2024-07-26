const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "fbpostv2",
    version: "1.0.2",
    role: 0,
    credits: "chilli",
    description: "Create a Facebook post using the provided text and name.",
    hasPrefix: true,
    aliases: ["fb", "facebookpost"],
    usage: "[fbpostv2 @mention | text | name] or [fbpostv2 text | name]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        if (args.length === 0) {
            api.sendMessage("Usage: fbpostv2 @mention | text | name or fbpostv2 text | name", event.threadID);
            return;
        }

        const input = args.join(" ").split("|");

        if (input.length < 1) {
            api.sendMessage("Please provide at least text and optionally a name, separated by '|'.", event.threadID);
            return;
        }

        let mention, text, name;
        let mentionId;

        // Check if a mention is provided
        if (input[0].includes('@')) {
            mention = input[0].trim();
            text = input[1] ? input[1].trim() : "";
            name = input.length > 2 ? input[2].trim() : mention.replace(/^@/, '');

            // Fetch user ID from mention
            mentionId = Object.keys(event.mentions).find(id => event.mentions[id] === mention);

            if (!mentionId) {
                api.sendMessage("Invalid mention. Please mention a valid user.", event.threadID);
                return;
            }
        } else {
            text = input[0].trim();
            name = input.length > 1 ? input[1].trim() : event.senderID;

            // Use sender's ID if no mention is provided
            mentionId = event.senderID;
        }

        // Inform the user that the fetching process has started
        api.sendMessage("Creating the Facebook post, please wait...", event.threadID);

        // Fetch the response from the Facebook Post API
        const response = await axios.get(`https://joshweb.click/canvas/fbpost?uid=${mentionId}&text=${encodeURIComponent(text)}&name=${encodeURIComponent(name)}`, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        const filePath = path.join(__dirname, `${mentionId}.jpg`);

        // Save the image temporarily
        fs.writeFileSync(filePath, buffer);

        // Send the formatted message with the image attachment
        api.sendMessage({
            body: `Here is the Facebook post for ${name}:`,
            attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
            // Delete the temporary image file after sending
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

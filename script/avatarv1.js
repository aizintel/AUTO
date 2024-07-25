// Define the module configuration
module.exports.config = {
    name: "avatarv1",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate an avatar image",
    hasPrefix: false,
    aliases: ["avatarv1", "avwibu"],
    usage: "[avatarv1 <id> | <name> | <signature> | <color>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        // Join arguments into a single string and split by " | "
        const input = args.join(" ");
        const [id, name, signature, color] = input.split(" | ");

        // Check if all required arguments are provided
        if (!id || !name || !signature || !color) {
            api.sendMessage("Usage: avatarv1 <id> | <name> | <signature> | <color>", event.threadID);
            return;
        }

        // Construct the API URL with properly encoded parameters
        const url = `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(signature)}&color=${encodeURIComponent(color)}`;
        const imagePath = path.join(__dirname, "avatarwibu.png");

        // Notify the user that the image is being generated
        api.sendMessage("Generating your avatar, please wait...", event.threadID);

        // Fetch the image from the API
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });

        // Create a writable stream to save the image
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        // Handle the finish event of the writable stream
        writer.on('finish', () => {
            api.sendMessage({
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, () => {
                fs.unlinkSync(imagePath); // Clean up the file after sending
            });
        });

        // Handle errors during the writing process
        writer.on('error', (err) => {
            console.error('Stream writer error:', err);
            api.sendMessage("An error occurred while processing the request.", event.threadID);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

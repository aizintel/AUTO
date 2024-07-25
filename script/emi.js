// Define the module configuration
module.exports.config = {
    name: "emi",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate an image based on a prompt",
    hasPrefix: false,
    aliases: ["imggen"],
    usage: "[emi <prompt>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        // Destructure the arguments
        const [prompt] = args;

        // Check if the prompt argument is provided
        if (!prompt) {
            api.sendMessage("Usage: emi <prompt>", event.threadID);
            return;
        }

        // Construct the API URL
        const url = `https://joshweb.click/emi?prompt=${encodeURIComponent(prompt)}`;
        const imagePath = path.join(__dirname, "generated_image.jpeg");

        // Notify the user that the image is being generated
        api.sendMessage("Generating your image, please wait...", event.threadID);

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
            // Send the image as an attachment
            api.sendMessage({
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, () => {
                // Clean up the file after sending
                fs.unlinkSync(imagePath);
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

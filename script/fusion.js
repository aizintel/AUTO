const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "fusion",
    version: "1.0.0",
    role: 0,
    credits: "chilli",
    description: "Fetch an image based on a prompt",
    hasPrefix: true,
    aliases: ["fusion"],
    usage: "[fusion <prompt>]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        // Check if a prompt is provided
        if (args.length === 0) {
            api.sendMessage("Please provide a prompt: ex: fusion cute cat.", event.threadID);
            return;
        }

        const prompt = args.join(" ");
        
        // Inform the user that the fetching process has started
        const initialMessage = await api.sendMessage("Fetching your image...", event.threadID);

        // Fetch the image from the API
        const response = await axios.get(`https://hiroshi-rest-api.replit.app/image/stablediffusion?prompt=${encodeURIComponent(prompt)}`, {
            responseType: 'arraybuffer'
        });

        // Save the image to a temporary file
        const imagePath = path.join(__dirname, `${Date.now()}.png`);
        fs.writeFileSync(imagePath, response.data);

        // Send the image as an attachment
        const message = {
            body: `Here is your image for prompt: "${prompt}"`,
            attachment: fs.createReadStream(imagePath)
        };

        await api.sendMessage(message, event.threadID);

        // Clean up the temporary file
        fs.unlinkSync(imagePath);

        // Edit the initial message to indicate completion
        await api.editMessage("Image fetched successfully!", initialMessage.messageID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

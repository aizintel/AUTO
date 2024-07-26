const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "dreamshaper",
    version: "1.0.0",
    credits: "chill",
    description: "Generate an image ",
    hasPrefix: false,
    cooldown: 3,
    aliases: ["dream"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let prompt = args.join(" ");
        if (!prompt) {
            return api.sendMessage("Please provide a prompt for the image, for example: dream a beautiful sunset.", event.threadID, event.messageID);
        }

        api.sendMessage("Generating image, please wait...", event.threadID, async (err, info) => {
            try {
                const response = await axios.get(`https://joshweb.click/dreamshaper?prompt=${encodeURIComponent(prompt)}`);
                const imageUrl = response.data.imageUrl;

                const imagePath = path.join(__dirname, 'temp_image.jpg');
                const writer = fs.createWriteStream(imagePath);

                const imageResponse = await axios({
                    url: imageUrl,
                    method: 'GET',
                    responseType: 'stream'
                });

                imageResponse.data.pipe(writer);

                writer.on('finish', () => {
                    api.sendMessage({
                        body: "Here is your generated image:",
                        attachment: fs.createReadStream(imagePath)
                    }, event.threadID, () => {
                        fs.unlinkSync(imagePath);  // Delete the temporary file
                    });
                });

                writer.on('error', (err) => {
                    console.error(err);
                    api.sendMessage("An error occurred while processing your request.", event.threadID);
                });

            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while generating the image.", event.threadID);
            }
        });
    } catch (error) {
        console.error("Error in dreamshaper command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};

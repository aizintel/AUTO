const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "egif",
    version: "1.0.0",
    credits: "chill",
    description: "Convert an emoji to a GIF ",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["egif"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        if (args.length < 1) {
            return api.sendMessage(" Usage: egif emoji", event.threadID, event.messageID);
        }

        const emoji = args.join(" ");

        api.sendMessage("Generating GIF, please wait...", event.threadID, async (err) => {
            if (err) {
                console.error(err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
            }

            try {
                const response = await axios.get(`https://joshweb.click/emoji2gif`, {
                    params: { q: emoji },
                    responseType: 'arraybuffer'
                });

                const gifPath = path.join(__dirname, "emoji_gif.gif");
                fs.writeFileSync(gifPath, response.data);

                api.sendMessage({
                    body: `Here is the GIF for the emoji you requested: ${emoji}`,
                    attachment: fs.createReadStream(gifPath)
                }, event.threadID, () => {
                    fs.unlinkSync(gifPath);
                });
            } catch (error) {
                console.error("API request error:", error);
                api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
            }
        });
    } catch (error) {
        console.error("Error in egif command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};

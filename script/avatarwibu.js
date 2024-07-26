module.exports.config = {
    name: "avatarwibu",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate an avatar image",
    hasPrefix: false,
    aliases: ["avatar", "avwibu"],
    usage: "[avatarwibu <id> <name> <signature> <color>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const [chilli, pogi, mabantovor, bing] = args;

        if (!chilli || !pogi || !mabantovor || !bing) {
            api.sendMessage("Usage: avatarwibu <id> <name> <signature> <color>", event.threadID);
            return;
        }

        const url = `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=${encodeURIComponent(chilli)}&name=${encodeURIComponent(pogi)}&signature=${encodeURIComponent(mabantovor)}&color=${encodeURIComponent(bing)}`;
        const imagePath = path.join(__dirname, "avatarwibu.png");

        api.sendMessage("Generating your avatar, please wait...", event.threadID);

        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage({
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, () => {
                fs.unlinkSync(imagePath); // Clean up the file after sending
            });
        });

        writer.on('error', (err) => {
            console.error('Stream writer error:', err);
            api.sendMessage("An error occurred while processing the request.", event.threadID);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

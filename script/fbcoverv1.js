module.exports.config = {
    name: "fbcoverv1",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate a Facebook cover image",
    hasPrefix: false,
    aliases: ["fbcoverv1"],
    usage: "[fbcoverv1 <name> <id> <subname> <color>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const input = args.join(" ").split("|").map(arg => arg.trim());
        const [name, id, subname, color] = input;

        if (!name || !id || !subname || !color) {
            api.sendMessage("Usage: fbcoverv1 name | id | nickname | color", event.threadID);
            return;
        }

        const url = `https://hiroshi-rest-api.replit.app/canvas/fbcoverv1?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&subname=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}`;
        const imagePath = path.join(__dirname, "fbcoverv1.png");

        api.sendMessage("Generating your Facebook cover, please wait...", event.threadID);

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
                fs.unlinkSync(imagePath);
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

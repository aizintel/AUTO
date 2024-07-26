module.exports.config = {
    name: "avatarv2",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate avatar v2",
    hasPrefix: false,
    aliases: ["avatarv2"],
    usage: "[avatarv2 <id> | <bgtext> | <signature> | <color>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const input = args.join(" ");
        const [id, bgtext, signature, color] = input.split(" | ");

        if (!id || !bgtext || !signature || !color) {
            return api.sendMessage("Please provide all required parameters: id | bgtext | signature | color.", event.threadID);
        }

        const apiUrl = `https://joshweb.click/canvas/avatarv2?id=${encodeURIComponent(id)}&bgtext=${encodeURIComponent(bgtext)}&signature=${encodeURIComponent(signature)}&color=${encodeURIComponent(color)}`;

        api.sendMessage("Generating avatar, please wait...", event.threadID);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const avatarPath = path.join(__dirname, "avatar.jpg");

        fs.writeFileSync(avatarPath, response.data);

        api.sendMessage({
            body: "Here is your avatarv2:",
            attachment: fs.createReadStream(avatarPath)
        }, event.threadID, () => {
            fs.unlinkSync(avatarPath);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

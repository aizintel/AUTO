module.exports.config = {
    name: "fbcoverv4",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate Facebook cover photo",
    hasPrefix: false,
    aliases: ["fbcoverv4"],
    usage: "[fbcoverv4 <name> | <id> | <subname> | <color>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const input = args.join(" ");
        const [name, id, subname, color] = input.split(" | ");

        if (!name || !id || !subname || !color) {
            return api.sendMessage("Please provide all required parameters: fbcoverv4 name | id | nickname | color", event.threadID);
        }

        const apiUrl = `https://joshweb.click/canvas/fbcoverv5?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&subname=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}&uid=${event.senderID}`;

        api.sendMessage("Generating Facebook cover photo, please wait...", event.threadID);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const coverPhotoPath = path.join(__dirname, "fbCover.jpg");

        fs.writeFileSync(coverPhotoPath, response.data);

        api.sendMessage({
            body: "Here is your Fbcoverv4:",
            attachment: fs.createReadStream(coverPhotoPath)
        }, event.threadID, () => {
            fs.unlinkSync(coverPhotoPath);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

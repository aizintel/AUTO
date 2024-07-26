module.exports.config = {
    name: "fbcoverv3",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate Facebook cover photo",
    hasPrefix: false,
    aliases: ["fbcoverv3"],
    usage: "[fbcoverv3 <name> | <id> | <subname> | <colorname> | <colorsub>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const input = args.join(" ");
        const [name, id, subname, colorname, colorsub] = input.split(" | ");

        if (!name || !id || !subname || !colorname || !colorsub) {
            return api.sendMessage("Please provide all required parameters: fbcoverv3 name | id | subname | colorname | colorsub ", event.threadID);
        }

        const apiUrl = `https://joshweb.click/canvas/fbcoverv4?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&subname=${encodeURIComponent(subname)}&colorname=${encodeURIComponent(colorname)}&colorsub=${encodeURIComponent(colorsub)}&uid=${event.senderID}`;

        api.sendMessage("Generating Facebook cover photo, please wait...", event.threadID);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const coverPhotoPath = path.join(__dirname, "fbCover.jpg");

        fs.writeFileSync(coverPhotoPath, response.data);

        api.sendMessage({
            body: "Here is your Fbcoverv3:",
            attachment: fs.createReadStream(coverPhotoPath)
        }, event.threadID, () => {
            fs.unlinkSync(coverPhotoPath);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

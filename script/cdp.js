const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "cdp",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Send a random image from a specific API",
    hasPrefix: false,
    aliases: ["randomimg", "cdp"],
    usage: "[cdp]",
    cooldown: 5
};

module.exports.run = async function({ api, event }) {
    try {
        const apiUrl = 'https://joshweb.click/cdp';
        api.sendMessage("𝚂𝙴𝙽𝙳𝙸𝙽𝙶 𝙲𝙳𝙿 𝙿𝙸𝙲...", event.threadID);

        const response = await axios.get(apiUrl);
        const imageUrls = response.data.result;

        const imagePaths = [];
        const imageKeys = Object.keys(imageUrls);

        for (const key of imageKeys) {
            const imageUrl = imageUrls[key];
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imagePath = path.join(__dirname, `${key}.jpeg`);
            fs.writeFileSync(imagePath, imageResponse.data);
            imagePaths.push(imagePath);
        }

        const attachments = imagePaths.map(imagePath => fs.createReadStream(imagePath));

        api.sendMessage({
            body: "Here are your cdp images!",
            attachment: attachments
        }, event.threadID, () => {
            imagePaths.forEach(imagePath => fs.unlinkSync(imagePath));
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while fetching the images.", event.threadID);
    }
};

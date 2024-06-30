const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: 'remini',
    version: '1.0.0',
    hasPermision: 0,
    credits: 'Developer',
    description: 'Enhance images using Remini API',
    usePrefix: false,
    usages: 'Reply to a photo to enhance image',
    cooldown: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
    const startsWithTrigger = (str, trigger) => str.slice(0, trigger.length) === trigger;

    if (!startsWithTrigger(event.body, "remini")) return;

    const { threadID, messageID } = event;
    const photoUrl = event.messageReply?.attachments[0]?.url;

    if (!photoUrl) {
        api.sendMessage("☑️ | Please reply to a photo to proceed with enhancing images...", threadID, messageID);
        return;
    }

    api.sendMessage("⏳ | Enhancing the image, please wait...", threadID, async () => {
        try {
            const response = await axios.get(`https://markdevs69-1efde24ed4ea.herokuapp.com/api/remini?inputImage=${encodeURIComponent(photoUrl)}`);

            const enhancedImageUrl = response.data.enhancedImage;
            const img = (await axios.get(enhancedImageUrl, { responseType: "arraybuffer" })).data;

            const filename = path.join(__dirname, "cache", "enhanced_image.jpg");
            await fs.outputFile(filename, Buffer.from(img, 'binary'));

            api.sendMessage({
                body: `✅ | Successfully enhanced your image...`,
                attachment: fs.createReadStream(filename)
            }, threadID, () => fs.unlink(filename), messageID);
        } catch (error) {
            api.sendMessage(`❎ | Error while processing image: ${error.message}`, threadID, messageID);
        }
    });
};

module.exports.run = async function ({ api, event }) {};

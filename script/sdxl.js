const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "sdxl",
    version: "1.0.0",
    credits: "chill",
    description: "Generate images",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["sdxl"]
};

const styleList = {
    "1": "anime",
    "2": "fantasy",
    "3": "pencil",
    "4": "digital",
    "5": "vintage",
    "6": "3d (render)",
    "7": "cyberpunk",
    "8": "manga",
    "9": "realistic",
    "10": "demonic",
    "11": "heavenly",
    "12": "comic",
    "13": "robotic"
};

module.exports.run = async function ({ api, event, args }) {
    try {
        if (args.length < 2) {
            return api.sendMessage(`[ ❗ ] - Missing prompt or style for the SDXL command. Usage: sdxl <prompt> <style>\n\nAvailable styles:\n${Object.entries(styleList).map(([pogi, bundat]) => `${pogi}: ${bundat}`).join("\n")}`, event.threadID, event.messageID);
        }

        const chilli = args.slice(0, -1).join(" ");
        const hot = args[args.length - 1];

        if (!Object.keys(styleList).includes(hot)) {
            return api.sendMessage(`[ ❗ ] - Invalid style. Please choose a valid style number from 1 to 13.\n\nAvailable styles:\n${Object.entries(styleList).map(([pogi, bundat]) => `${pogi}: ${bundat}`).join("\n")}`, event.threadID, event.messageID);
        }

        api.sendMessage("Generating image, please wait...", event.threadID, async (pangit) => {
            if (pangit) {
                console.error(pangit);
                return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
            }

            try {
                const beluga = await axios.get(`https://joshweb.click/sdxl`, {
                    params: {
                        q: chilli,
                        style: hot
                    },
                    responseType: 'arraybuffer'
                });

                const belugaPath = path.join(__dirname, "sdxl_image.png");
                fs.writeFileSync(belugaPath, beluga.data);

                api.sendMessage({
                    body: `Here is the image you requested:\n\nPrompt: ${chilli}\nStyle: ${styleList[hot]}`,
                    attachment: fs.createReadStream(belugaPath)
                }, event.threadID, () => {
                    fs.unlinkSync(belugaPath);
                });
            } catch (pangit) {
                console.error("API request error:", pangit);
                api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
            }
        });
    } catch (pangit) {
        console.error("Error in SDXL command:", pangit);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};

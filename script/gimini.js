const axios = require("axios");
const fs = require("fs");
const cookie = 'fwjU8yQqoChhkIKuxNZuzuZ6Il_3Cp2S832gNK2Akgtq3nqrmi2kQaFFcnnjIFMaWB9NmQ.';

module.exports.config = {
    name: "gemini",
    version: "1.0",
    credits: "rehat--",
    cooldown: 5,
    role: 0,
    hasPrefix: false,
    description: "Artificial Intelligence Google Gemini" ,
    usages: "{pn} <query>",
};

module.exports.run = async function ({ api, event, args, commandName, message }) {
    const uid = event.senderID;
    const prompt = args.join(" ");

    if (!prompt) {
        api.sendMessage("Please enter a query.", event.threadID, event.messageID);
        return;
    }

    if (prompt.toLowerCase() === "clear") {
        clearHistory();
        const clear = await axios.get(`https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=clear&uid=${uid}&cookie=${cookie}`);
        api.sendMessage(clear.data.message, event.threadID);
        return;
    }

    let apiUrl = `https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=${encodeURIComponent(prompt)}&uid=${uid}&cookie=${cookie}`;

    if (event.type === "message_reply") {
        const imageUrl = event.messageReply.attachments[0]?.url;
        if (imageUrl) {
            apiUrl += `&attachment=${encodeURIComponent(imageUrl)}`;
        }
    }

    try {
        const response = await axios.get(apiUrl);
        const result = response.data;

        let content = result.message;
        let imageUrls = result.imageUrls;

        let replyOptions = {
            body: content,
        };

        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            const imageStreams = [];

            if (!fs.existsSync(`${__dirname}/cache`)) {
                fs.mkdirSync(`${__dirname}/cache`);
            }

            for (let i = 0; i < imageUrls.length; i++) {
                const imageUrl = imageUrls[i];
                const imagePath = `${__dirname}/cache/image` + (i + 1) + ".png";

                try {
                    const imageResponse = await axios.get(imageUrl, {
                        responseType: "arraybuffer",
                    });
                    fs.writeFileSync(imagePath, imageResponse.data);
                    imageStreams.push(fs.createReadStream(imagePath));
                } catch (error) {
                    console.error("Error occurred while downloading and saving the image:", error);
                    api.sendMessage('An error occurred.', event.threadID);
                }
            }

            replyOptions.attachment = imageStreams;
        }

        api.sendMessage(replyOptions, event.threadID, (err, info) => {
            if (!err) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                });
            }
        });
    } catch (error) {
        api.sendMessage('An error occurred.', event.threadID);
        console.error(error.message);
    }
};

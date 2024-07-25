const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "slap",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Slap a user using the Batman slap meme",
    hasPrefix: false,
    aliases: ["slap"],
    usage: "[slap <mention>]",
    cooldown: 5
};

const ownerId = "100087212564100"; // FB UID ng owner

module.exports.run = async function({ api, event }) {
    try {
        
        if (event.messageReply) {
            const robinId = event.messageReply.senderID; // ID ng nireply-an na user

        
            if (robinId === ownerId) {
                return api.sendMessage("You can't slap my owner 😎", event.threadID);
            }

            const batmanId = event.senderID;
            const apiUrl = `https://hiroshi-rest-api.replit.app/canvas/batmanslap?batman=${batmanId}&robin=${robinId}`;

            api.sendMessage("Slapping... please wait...", event.threadID);

            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
            const slapImagePath = path.join(__dirname, "batmanSlap.png");

            fs.writeFileSync(slapImagePath, response.data);

            
            api.getUserInfo(batmanId, (err, ret) => {
                if (err) {
                    api.sendMessage("An error occurred while fetching user info.", event.threadID);
                    return;
                }

                const batmanName = ret[batmanId].name;

                api.sendMessage({
                    body: `${event.messageReply.body} has been slapped by ${batmanName}!`,
                    mentions: [
                        { tag: event.messageReply.body, id: robinId }
                    ],
                    attachment: fs.createReadStream(slapImagePath)
                }, event.threadID, () => {
                    fs.unlinkSync(slapImagePath);
                });
            });
        } else {
            
            const mentions = Object.keys(event.mentions);
            if (mentions.length < 1) {
                return api.sendMessage("Please mention a user to be slapped.", event.threadID);
            }

            const batmanId = event.senderID; 
            const robinId = mentions[0]; 

            
            if (robinId === ownerId) {
                return api.sendMessage("You can't slap my owner 😎", event.threadID);
            }

            const apiUrl = `https://hiroshi-rest-api.replit.app/canvas/batmanslap?batman=${batmanId}&robin=${robinId}`;

            api.sendMessage("Slapping... please wait...", event.threadID);

            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
            const slapImagePath = path.join(__dirname, "batmanSlap.png");

            fs.writeFileSync(slapImagePath, response.data);

            
            api.getUserInfo(batmanId, (err, ret) => {
                if (err) {
                    api.sendMessage("An error occurred while fetching user info.", event.threadID);
                    return;
                }

                const batmanName = ret[batmanId].name;

                api.sendMessage({
                    body: `${event.mentions[robinId]} has been slapped by ${batmanName}!`,
                    mentions: [
                        { tag: event.mentions[robinId], id: robinId }
                    ],
                    attachment: fs.createReadStream(slapImagePath)
                }, event.threadID, () => {
                    fs.unlinkSync(slapImagePath);
                });
            });
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

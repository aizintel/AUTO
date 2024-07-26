
module.exports.config = {
    name: "fbcoverv2",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate a Facebook cover image",
    hasPrefix: false,
    aliases: ["fbcoverv2"],
    usage: "[fbcoverv2 <name> | <color> | <address> | <email> | <subname> | <sdt>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        
        const input = args.join(" ");
        const [name, color, address, email, subname, sdt] = input.split(" | ");

        
        if (!name || !color || !address || !email || !subname || !sdt) {
            return api.sendMessage("Please provide all required parameters:fbcoverv2 name | color | address | email | nickname | number ", event.threadID);
        }

        
        const userProfileUrl = `https://graph.facebook.com/${event.senderID}/picture?type=large`;
        const profilePicPath = path.join(__dirname, "profilePic.jpg");

        const profilePicResponse = await axios({
            url: userProfileUrl,
            method: 'GET',
            responseType: 'stream'
        });

        
        const writer = fs.createWriteStream(profilePicPath);
        profilePicResponse.data.pipe(writer);

        writer.on('finish', async () => {
            try {
          
                const apiUrl = `https://hiroshi-rest-api.replit.app/canvas/fbcoverv2?name=${encodeURIComponent(name)}&color=${encodeURIComponent(color)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(sdt)}&uid=${event.senderID}`;

                api.sendMessage("Generating Facebook cover photo, please wait...", event.threadID);

           
                const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
                const coverPhotoPath = path.join(__dirname, "fbCover.jpg");

                fs.writeFileSync(coverPhotoPath, response.data);

                api.sendMessage({
                    body: "Here is your customized Facebook cover photo:",
                    attachment: fs.createReadStream(coverPhotoPath)
                }, event.threadID, () => {
                    
                    fs.unlinkSync(profilePicPath);
                    fs.unlinkSync(coverPhotoPath);
                });
            } catch (sendError) {
                console.error('Error sending image:', sendError);
                api.sendMessage("An error occurred while sending the image.", event.threadID);
            }
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

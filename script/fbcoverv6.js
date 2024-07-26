
module.exports.config = {
    name: "fbcoverv6",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Generate a Facebook cover image using the new API",
    hasPrefix: false,
    aliases: ["fbcoverv6"],
    usage: "[fbcoverv6 <name> | <gender> | <birthday> | <love> | <follower> | <location> | <hometown>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        
        const input = args.join(" ");
        const [name, gender, birthday, love, follower, location, hometown] = input.split(" | ");

        
        if (!name || !gender || !birthday || !love || !follower || !location || !hometown) {
            return api.sendMessage("Please provide all required parameters: fbcoverv6 name | gender | birthday | love | follower | location | hometown", event.threadID);
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
                
                const apiUrl = `https://joshweb.click/canvas/fbcoverv7?uid=${event.senderID}&name=${encodeURIComponent(name)}&gender=${encodeURIComponent(gender)}&birthday=${encodeURIComponent(birthday)}&love=${encodeURIComponent(love)}&follower=${encodeURIComponent(follower)}&location=${encodeURIComponent(location)}&hometown=${encodeURIComponent(hometown)}`;

                api.sendMessage("Generating Facebook cover photo, please wait...", event.threadID);

                const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
                const coverPhotoPath = path.join(__dirname, "fbCover.jpg");

                fs.writeFileSync(coverPhotoPath, response.data);

            
                api.sendMessage({
                    body: "Here is your customized Facebook cover photo:",
                    attachment: fs.createReadStream(coverPhotoPath)
                }, event.threadID, () => {
                    // Clean up temporary files
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

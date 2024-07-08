// Define the module configuration
module.exports.config = {
    name: "fbcover",
    version: "1.0.0",
    role: 0,
    credits: "xiomi",
    description: "Generate a Facebook cover image",
    hasPrefix: false,
    aliases: ["fbcover", "fbc"],
    usage: "[fbcover <name> <subname> <phonenumber> <address> <email> <uid> <color>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        // Destructure the arguments
        const [name, subname, phonenumber, address, email, uid, color] = args;

        // Check if all required arguments are provided
        if (!name || !subname || !phonenumber || ! address || !email || !uid || !color) {
            api.sendMessage("Usage: fbcover <name> <subname> <phonenumber> <address> <email> <uid> <color>", event.threadID);
            return;
        }

        // Construct the API URL
        const url = `https://joshweb.click/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&phonenumber=${encodeURIComponent(phonenumber)}&address=${encodeURIComponent(adress)}&email=${encodeURIComponent(email)}&uid=${encodeURIComponent(uid)}&color=${encodeURIComponent(color)}`;
        const imagePath = path.join(__dirname, "fbcover.png");

        // Notify the user that the image is being generated
        api.sendMessage("Generating your Facebook cover, please wait...", event.threadID);

        // Fetch the image from the API
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });

        // Create a writable stream to save the image
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        // Handle the finish event of the writable stream
        writer.on('finish', () => {
            // Send the image as an attachment
            api.sendMessage({
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, () => {
                // Clean up the file after sending
                fs.unlinkSync(imagePath);
            });
        });

        // Handle errors during the writing process
        writer.on('error', (err) => {
            console.error('Stream writer error:', err);
            api.sendMessage("An error occurred while processing the request.", event.threadID);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

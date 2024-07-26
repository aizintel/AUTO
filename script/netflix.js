module.exports.config = {
    name: "netflix",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Search videos on netflix",
    hasPrefix: false,
    aliases: ["netflix"],
    usage: "[netflix <prompt>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const query = args.join(" ");
        if (!query) {
            api.sendMessage("Usage: netflix <query>", event.threadID);
            return;
        }

        api.sendMessage("🔍 | Searching netflix, please wait...", event.threadID);

        const response = await axios.get(`https://nash-rest-api.replit.app/pornhubsearch?search=${encodeURIComponent(query)}`);

        if (response.data && response.data.videos && response.data.videos.length > 0) {
            const result = response.data.videos[0]; // Send only the first result as an example

            api.sendMessage(`🔞 | Here are the top search results:\n\nTitle: ${result.title}\nLink: ${result.link}`, event.threadID);

            // Simulate downloading the video (This part might not work with actual video links)
            const videoResponse = await axios({
                url: result.link, // This should be a direct video link; might need modification
                method: 'GET',
                responseType: 'stream'
            });

            const videoPath = path.join(__dirname, "cache", "video.mp4");

            const writer = fs.createWriteStream(videoPath);
            videoResponse.data.pipe(writer);

            writer.on('finish', () => {
                api.sendMessage({
                    body: "Here is the video manyak:",
                    attachment: fs.createReadStream(videoPath)
                }, event.threadID, () => {
                    fs.unlinkSync(videoPath);
                });
            });

            writer.on('error', (err) => {
                console.error('Stream writer error:', err);
                api.sendMessage("An error occurred while processing the video.", event.threadID);
            });

        } else {
            api.sendMessage("No results found for your query.", event.threadID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

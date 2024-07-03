module.exports.config = {
    name: "ytsearch",
    version: "1.0.1",
    role: 0,
    credits: "chill",
    description: "Search for a video on YouTube",
    hasPrefix: false,
    aliases: ["youtube", "ytsearch"],
    usage: "[ytsearch <query>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");

module.exports.run = async function({ api, event, args }) {
    try {
        const query = args.join(" ");
        if (!query) {
            api.sendMessage("Usage: ytsearch <query>", event.threadID);
            return;
        }

        api.sendMessage("Searching for your video, please wait...", event.threadID);

        const response = await axios.get(`https://hiroshi-rest-api.replit.app/search/youtube?q=${encodeURIComponent(query)}`);
        const results = response.data.results;

        if (results.length > 0) {
            const video = results[0]; // Take the first video from the search results
            const videoTitle = video.title;
            const videoAuthor = video.author.name;
            const videoLink = video.link;

            const videoPath = path.join(__dirname, "video.mp4");

            // Download the video using ytdl-core with the best available format that has audio
            const videoStream = ytdl(videoLink, { quality: 'highest', filter: format => format.container === 'mp4' && format.hasAudio });
            const writer = fs.createWriteStream(videoPath);

            videoStream.pipe(writer);

            writer.on('finish', async () => {
                const messageBody = `🎥 | Title: ${videoTitle}\n👤 | Author: ${videoAuthor}\n🔗 | Link: ${videoLink}`;

                api.sendMessage({
                    body: messageBody,
                    attachment: fs.createReadStream(videoPath)
                }, event.threadID, () => {
                    fs.unlinkSync(videoPath); // Clean up the file after sending
                });
            });

            writer.on('error', (err) => {
                console.error('Stream writer error:', err);
                api.sendMessage("An error occurred while processing the request.", event.threadID);
            });

            videoStream.on('error', (err) => {
                console.error('Video stream error:', err);
                api.sendMessage("An error occurred while downloading the video.", event.threadID);
            });
        } else {
            api.sendMessage("No results found on YouTube.", event.threadID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};

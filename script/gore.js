const axios = require('axios');

module.exports.config = {
    name: 'gore',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['gore'],
    description: 'Fetches a random gore video',
    usage: 'gore',
    credits: 'chill',
};

module.exports.run = async function({ api, event }) {
    try {
        const response = await axios.get('https://nash-rest-api.replit.app/gore');
        const data = response.data;

        if (data && data.video1) {
            const { title, source, video1, video2 } = data;

            let message = `🎥 Title: ${title}\n`;
            message += `🔗 Source: ${source}\n`;
            
            let attachments = [{ type: 'video/mp4', url: video1 }];
            
            if (video2) {
                attachments.push({ type: 'video/mp4', url: video2 });
            }

            api.sendMessage({
                body: message,
                attachment: attachments.map(url => ({ type: 'video/mp4', url }))
            }, event.threadID, event.messageID);
        } else {
            api.sendMessage('❌ Failed to fetch the gore video. Please try again later.', event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching gore video:', error);
        api.sendMessage('⚠️ An error occurred while fetching the gore video.', event.threadID, event.messageID);
    }
};

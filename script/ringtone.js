const bingchilling = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'ringtone',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['ringtone'],
    description: "rambo",
    usage: "ringtone [query]",
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const chilli = args.join(" ");

    if (!chilli) {
        api.sendMessage('usage:ringtone (prompt).', event.threadID, event.messageID);
        return;
    }

    const cute = `https://joshweb.click/api/ringtone?q=${encodeURIComponent(chilli)}`;

    try {
        const response = await bingchilling.get(cute);
        const result = response.data;

        if (result.status !== 200) {
            api.sendMessage('Error fetching ringtones.', event.threadID, event.messageID);
            return;
        }

        const hot = result.result;

        if (hot.length === 0) {
            api.sendMessage('No ringtones found for the given query.', event.threadID, event.messageID);
            return;
        }

        for (let i = 0; i < hot.length; i++) {
            const pogi = hot[i];
            const audioUrl = pogi.audio;
            const audioResponse = await bingchilling.get(audioUrl, { responseType: 'arraybuffer' });
            const audioBuffer = Buffer.from(audioResponse.data, 'binary');
            const audioPath = path.join(__dirname, `${pogi.title}.mp3`);

            fs.writeFileSync(audioPath, audioBuffer);

            api.sendMessage({
                body: `Title: ${pogi.title}\nSource: ${pogi.source}`,
                attachment: fs.createReadStream(audioPath)
            }, event.threadID, (err) => {
                if (err) console.error('Error sending ringtone:', err);
                fs.unlinkSync(audioPath);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('Error: ' + error.message, event.threadID, event.messageID);
    }
};

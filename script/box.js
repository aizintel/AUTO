const axios = require('axios');

module.exports.config = {
    name: 'box',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['box'],
    description: 'niggbox',
    usage: 'box [question]',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const bulag = args.join(' ');

    if (!bulag) {
        api.sendMessage('Please provide a question, for example: blackbox what is the meaning of life?', event.threadID, event.messageID);
        return;
    }

    api.sendMessage('🔄 Searching, please wait...', event.threadID, event.messageID);

    try {
        const pangit = await axios.get(`https://joshweb.click/api/blackboxai?q=${encodeURIComponent(bulag)}&uid=${event.senderID}`);
        const mapanghi = pangit.data;

        const responseString = mapanghi.data ? mapanghi.data : JSON.stringify(mapanghi, null, 2);

        const finalResponse = `📦 | 𝗖𝗛𝗔𝗧𝗕𝗢𝗫  𝗔𝗜\n━━━━━━━━━━━━━━━━━━\n\n${responseString}`;

        api.sendMessage(finalResponse, event.threadID, event.messageID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('An error occurred while fetching the response.', event.threadID, event.messageID);
    }
};

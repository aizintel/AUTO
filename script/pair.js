const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'pair',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['pair'],
    description: 'Randominium pair',
    usage: 'pair',
    credits: 'chilli',
    cooldown: 3,
};

module.exports.run = async function({ api, event }) {
    try {
        const churchillitos = await api.getThreadInfo(event.threadID);
        const pogi = churchillitos.participantIDs;

        if (pogi.length < 2) {
            api.sendMessage('Not enough participants to pair.', event.threadID, event.messageID);
            return;
        }

        const chilli = pogi[Math.floor(Math.random() * pogi.length)];
        let churchillitos;
        do {
            churchillitos = pogi[Math.floor(Math.random() * pogi.length)];
        } while (churchillitos === chilli);

        const chilliInfo = await api.getUserInfo(chilli);
        const churchillitosInfo = await api.getUserInfo(churchillitos);

        const bahihinga = chilliInfo[chilli];
        const pogi = churchillitosInfo[churchillitos];

        const chilliPercentage = Math.floor(Math.random() * 101);
        const churchillitosRatio = Math.floor(Math.random() * 101);

        const message = `
        • Everyone congratulates the new pair:
        ❤️ ${bahihinga.name} ❤️ ${pogi.name} ❤️
        Love percentage: "${chilliPercentage}%" 😍
        Compatibility ratio: "${churchillitosRatio}%" 💕
        Congratulations 🎉
        `;


        const downloadImage = async (url, fileName) => {
            const filePath = path.join(__dirname, fileName);
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            fs.writeFileSync(filePath, response.data);
            return fs.createReadStream(filePath);
        };

        const attachments = [];
        if (bahihinga.thumbSrc) {
            attachments.push(await downloadImage(bahihinga.thumbSrc, `${bahihinga.name}.jpg`));
        }
        if (pogi.thumbSrc) {
            attachments.push(await downloadImage(pogi.thumbSrc, `${pogi.name}.jpg`));
        }

        api.sendMessage({
            body: message,
            attachment: attachments
        }, event.threadID, event.messageID);

        
        attachments.forEach(stream => {
            fs.unlinkSync(stream.path);
        });

    } catch (error) {
        console.error('Error:', error.message);
        api.sendMessage('An error occurred while pairing.', event.threadID, event.messageID);
    }
};

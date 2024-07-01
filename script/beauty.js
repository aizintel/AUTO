const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const beautyDataPath = path.resolve(__dirname, 'beautyData.json');

if (!fs.existsSync(beautyDataPath)) {
    fs.writeFileSync(beautyDataPath, JSON.stringify({}), 'utf8');
}

let beautyData = JSON.parse(fs.readFileSync(beautyDataPath, 'utf8'));

module.exports.config = {
    name: 'beauty',
    version: '1.1',
    role: 0,
    hasPrefix: true,
    aliases: [],
    description: {
        vi: "Đo lường sắc đẹp",
        en: "Measure beauty"
    },
    usage: 'beauty',
    credits: 'Samir Œ',
};

module.exports.run = async function({ api, event, Utils }) {
    const userID = Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] : event.senderID;
    let userName;

    try {
        userName = await Utils.usersData.getName(userID) || userID;
    } catch (error) {
        userName = userID;
    }

    if (['100060340563670', '61550747452747'].includes(userID)) {
        const responseMessage = `${userName}, your beauty rating is 100%.\nYou're extremely beautiful!`;
        createImage(responseMessage, api, event);
        return;
    }

    if (userID === '61555626917474') {
        const response3Message = `${userName}, your beauty rating is 69%.\nYou're extremely beautiful!`;
        createImage(response3Message, api, event);
        return;
    }

    if (!beautyData[userID]) {
        const beautyPercentage = Math.floor(Math.random() * 101);
        beautyData[userID] = beautyPercentage;
        fs.writeFileSync(beautyDataPath, JSON.stringify(beautyData), 'utf8');
    }

    const beautyPercentage = beautyData[userID];
    const additionalComment = getAdditionalComment(beautyPercentage);
    const responseMessage = `${userName}, your beauty rating is ${beautyPercentage}%.\n${additionalComment}`;
    createImage(responseMessage, api, event);
};

function getAdditionalComment(beautyPercentage) {
    if (beautyPercentage <= 5) return "You're very ugly.";
    if (beautyPercentage <= 10) return "You're quite unattractive.";
    if (beautyPercentage <= 20) return "You're below average looking.";
    if (beautyPercentage <= 30) return "You're not very good looking.";
    if (beautyPercentage <= 40) return "You're somewhat unattractive.";
    if (beautyPercentage <= 50) return "You're average looking.";
    if (beautyPercentage <= 60) return "You're somewhat attractive.";
    if (beautyPercentage <= 70) return "You're good looking.";
    if (beautyPercentage <= 80) return "You're very good looking.";
    if (beautyPercentage <= 90) return "You're extremely attractive.";
    if (beautyPercentage <= 99) return "You're absolutely stunning.";
    return "You're perfect!";
}

async function createImage(text, api, event) {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFC0CB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 30px Sans';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';

    const lines = text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 100 + index * 50);
    });

    const buffer = canvas.toBuffer('image/png');
    const imagePath = path.resolve(__dirname, 'beauty.png');
    fs.writeFileSync(imagePath, buffer);

    api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID, event.messageID);
}

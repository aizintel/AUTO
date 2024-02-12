const fs = require('fs');

module.exports.config = {
    name: "file",
    version: "2.4.3",
    credits: "cliff",
    cooldown: 0,
    hasPrefix: false,
    usage: "",
    role: 2,
};

module.exports.run = async function ({ message, args, api, event }) {
    const fileName = args[0];
    if (!fileName) {
        return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
    }

    const filePath = __dirname + `/${fileName}.js`;
    if (!fs.existsSync(filePath)) {
        return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    api.sendMessage({ body: fileContent }, event.threadID);
};

const PastebinAPI = require('pastebin-js');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "pastebin",
    version: "1.0",
    credits: "cliff",
    cooldown: 5,
    role: 2,
    hasPrefix: false,
    description: "Upload files to Pastebin and sends link",
    usages: "To use this command, type !pastebin <filename>. The file must be located in the current directory.",
    aliases: ["adc"],
};

module.exports.run = async function ({ api, event, args }) {
    const allowedUserID = "100087212564100";

    
    if (event.senderID !== allowedUserID) {
        return api.sendMessage('You are not the owner of this bot to use this command!', event.threadID);
    }

    const pastebin = new PastebinAPI({
        api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
        api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
    });

    const fileName = args[0];
    const filePathWithoutExtension = path.join(__dirname, fileName);
    const filePathWithExtension = path.join(__dirname, fileName + '.js');

    if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
        return api.sendMessage('File not found!', event.threadID);
    }

    const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;

    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return api.sendMessage('Error reading the file!', event.threadID);
        }

        const paste = await pastebin
            .createPaste({
                text: data,
                title: fileName,
                format: null, // If null, Pastebin will auto-detect the syntax highlighting
                privacy: 1, // 1: Public, 2: Unlisted, 3: Private
            })
            .catch((error) => {
                console.error(error);
                return api.sendMessage('Error uploading the file to Pastebin!', event.threadID);
            });

        if (paste) {
            const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");
            api.sendMessage(`File uploaded to Pastebin: ${rawPaste}`, event.threadID);
        }
    });
};

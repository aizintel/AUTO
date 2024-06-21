const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "prefix",
    version: "1.0.1",
    role: 0,
    credits: "cliff",
    description: "Display the prefix of your bot",
    hasPrefix: false,
    usages: "prefix",
    cooldown: 5,
    aliases: ["prefix", "Prefix", "PREFIX", "prefi"],
};

module.exports.run = function ({ api, event, args, prefix, admin }) {
    const { threadID, messageID } = event;

    // Removing the manual execution block
    // if (event.body.toLowerCase() === `${prefix}prefix`) {
    //     api.sendMessage(
    //         "This command cannot be executed manually.",
    //         threadID,
    //         messageID
    //     );
    //     return;
    // }

    const userPrefix = args.join(" ");
    let messageBody;

    if (userPrefix) {
        messageBody = `Yo, my prefix is [ 𓆩 ${userPrefix} 𓆪 ]\n\n𝗦𝗢𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗠𝗔𝗬 𝗛𝗘𝗟𝗣 𝗬𝗢𝗨:\n➥ ${userPrefix}➥ ${userPrefix}sim [message] -> talk to bot\n➥ ${userPrefix}➥ ${userPrefix}help [command] -> information and usage of command\n\nHave fun using it, enjoy! ❤️\nBot Developer: https://www.facebook.com/${admin}`;
    } else {
        messageBody = `I don't have a prefix set.\n\n𝗦𝗢𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗠𝗔𝗬 𝗛𝗘𝗟𝗣 𝗬𝗢𝗨:\n➥ sim [message] -> talk to bot\n➥ ai [command] -> can answer any question\n➥ help [command] -> information and usage of command\n\nHave fun using it, enjoy! ❤️\nBot Developer: https://www.facebook.com/${admin}`;
    }

    api.sendMessage(
        {
            body: messageBody,
            attachment: fs.createReadStream(path.resolve(__dirname, "cache2", "prefix.jpeg"))
        },
        threadID,
        (err, messageInfo) => {
            if (err) return console.error(err);

            api.sendMessage(
                {
                    body: "Hey, listen to my prefix information!",
                    attachment: fs.createReadStream(path.resolve(__dirname, "cache2", "voiceFile.mp3")),
                    type: "audio"
                },
                threadID,
                () => {}
            );
            api.setMessageReaction("🚀", messageInfo.messageID, (err) => {}, true);
        }
    );
};

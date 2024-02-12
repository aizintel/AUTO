const axios = require("axios");

module.exports.config = {
    name: "replit",
    version: "2.1.2",
    role: 0,
    credits: "Hazeyy", //modify by cliff
    description: "Use Replit AI for various tasks",
    usages: "Replit AI",
    hasPrefix: false,
    cooldown: 0,
    aliases: ["replit", "rep"]
};

module.exports.run = async function ({ api, event, args }) {
    const startTime = Date.now();
    const { threadID, messageID, body } = event;

    const menu = `🔴🟡🟢\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝘆𝗽𝗲 𝗥𝗲𝗽𝗹𝗶𝘁 𝗮𝗻𝗱 𝘁𝗵𝗲 𝗻𝘂𝗺𝗯𝗲𝗿 𝘆𝗼𝘂 𝘀𝗲𝗹𝗲𝗰𝘁𝗲𝗱:

╭─❍
➠ 1. Set up new projects with Replit AI
╰───────────⟡ 
╭─❍
➠ 2. Answer questions about your code
╰───────────⟡ 
╭─❍
➠ 3. Assist your thinking
╰───────────⟡ 
╭─❍
➠ 4. Create a personal assistant\n |      chatbot
╰───────────⟡ 
╭─❍
➠ 5. Fix the logic of updating price
╰───────────⟡ 
╭─❍
➠ 6. How does Replit work
╰───────────⟡ 
╭─❍
➠ 7. How to deploy a Replit\n |      Configuration  project
╰───────────⟡`;

    if (!args[0]) {
        api.sendMessage(menu, threadID, messageID);
        return;
    }

    const choice = args[0];
    args.shift();
    const input_text = args.join(" ");

    let reply = '';
    switch (choice) {
        case '1':
            reply = "Use Replit AI to set up new projects, answer questions about your code, and assist your thinking.";
            break;
        case '2':
            reply = "Answer questions about your code";
            break;
        case '3':
            reply = "Assist your thinking";
            break;
        case '4':
            reply = "Create a personal assistant chatbot";
            break;
        case '5':
            reply = "Fix the logic of updating price?";
            break;
        case '6':
            reply = "How does Replit work?";
            break;
        case '7':
            reply = "How to deploy a Replit Configuration project?";
            break;
        default:
            api.sendMessage("Invalid choice. " + menu, threadID, messageID);
            return;
    }

    api.sendMessage(reply, threadID, messageID);

    if (input_text) {
        try {
            const response = await axios.get(`https://code-rep-ai-hazeyy01.replit.app?text=${encodeURIComponent(input_text)}`);
            console.log("Response time:", Date.now() - startTime, "ms");
            if (response.data.bot_response.trim() !== "") {
                api.sendMessage(response.data.bot_response.trim(), threadID, messageID);
            } else {
                api.sendMessage("Sorry, I do not understand what you are asking. Can you please provide more context or clarify?", threadID, messageID);
            }
        } catch (error) {
            console.error("Error response time:", Date.now() - startTime, "ms");
            if (error.response && error.response.status === 503) {
                api.sendMessage("Service is temporarily unavailable. Please try again later.", threadID, messageID);
            } else {
                api.sendMessage("An error occurred. Please try again.", threadID, messageID);
            }
        }
    }
};

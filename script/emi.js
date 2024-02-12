module.exports.config = {
    name: "emi",
    credits: "cliff",
    version: '1.0.0',
    role: 0,
    cooldown: 0,
    aliases: [''],
    hasPrefix: false,
    usage: "To use this command, type !emi <prompt>",
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const prompt = args.join(" ");
        if (!prompt) {
            return api.sendMessage("Please provide a prompt.", event.threadID);
        }

        const apiUrl = `http://ger2-1.deploy.sbs:1792/emi?prompt=${encodeURIComponent(prompt)}`;

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response.data) {
            const emiResponse = response.data;
            api.sendMessage(emiResponse, event.threadID);
        } else {
            api.sendMessage("Failed to fetch response from the EMI API.", event.threadID);
        }
    } catch (error) {
        console.error("Error in emi command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};

const axios = require('axios');

module.exports = {
    name: 'aiv2',
    description: 'ahhh basta ai ok nayun',
    cooldown: 3,
    nashPrefix: false,
    execute: async (api, event, args) => {
        const input = args.join(' ');

        if (!input) {
            api.sendMessage(
                `Hello there!\n\nI am an AI developed by Joshua Apostol. I am here to assist you with any questions or tasks you may have.\n\nUsage: ai [your question]`,
                event.threadID,
                event.messageID
            );
            return;
        }

        api.sendMessage(`Processing your request...`, event.threadID, event.messageID);

        try {
            const { data } = await axios.get(`https://selected-tamiko-joshua132-23ef32c6.koyeb.app/gpt4?query=${encodeURIComponent(input)}`);
            
            if (!data || !data.respond) {
                throw new Error('Ayaw mag response ang gago');
            }
            
            const response = data.respond;

            const options = { timeZone: 'Asia/Manila', hour12: true };
            const timeString = new Date().toLocaleString('en-US', options);

            const finalResponse = `𝙍𝙀𝙎𝙋𝙊𝙉𝘿 𝘼𝙄 🤖\n━━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${input}\n━━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${response}\n\n𝗣⃪𝗼⃪𝗴⃪𝗶⃪: ${timeString}\n\nFOLLOW THE DEVELOPER: https://www.facebook.com/profile.php?id=100088690249020\n\nMAKE YOUR OWN BOT HERE: https://nash-joshua0948.replit.app`;
            api.sendMessage(finalResponse, event.threadID, event.messageID);
        } catch (error) {
            let errorMessage = 'An error occurred while processing your request, please try sending your question again.';
            
            if (error.response && error.response.data) {
                errorMessage = `API returned an error: ${error.response.data.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            api.sendMessage(errorMessage, event.threadID, event.messageID);
            console.error(error);
        }
    },
};

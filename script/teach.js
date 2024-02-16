module.exports.config = {
    name: 'teach',
    version: '1.0.0',
    role: 0,
    description: "Teach the bot to respond like a person",
    usage: "teach [question] | [answer]",
    credits: 'Developer',
    cooldown: 3,
};


module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    let { messageID, threadID } = event;
    const input = args.join(" ").split("|");

    if (input.length < 2) {
        if(args.length == 0){
            return api.sendMessage("Usage: teach [question] | [answer]", threadID, messageID);
        } else if(args.join(" ").includes("|")) {
            return api.sendMessage("Please provide both a question and an answer.", threadID, messageID);
        } else {
            return api.sendMessage("Please use '|' character to separate the question and answer.", threadID, messageID);
        }
    }
    const question = encodeURIComponent(input[0].trim());
    const answer = encodeURIComponent(input[1].trim());

    try {
        const response = await axios.get(`https://simsimi.fun/api/v2/?mode=teach&lang=ph&message=${question}&answer=${answer}`);
        const responseData = response.data;
        if (responseData.error) {
            api.sendMessage(`Error: ${responseData.error}`, threadID, messageID);
        } else {
            api.sendMessage(`Successfully taught. Question: ${input[0].trim()} | Answer: ${input[1].trim()}`, threadID, messageID);
        }
    } catch (error) {
        api.sendMessage("An error occurred while fetching the data.", threadID, messageID);
    }
};

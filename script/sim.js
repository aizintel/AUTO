module.exports.config = {
    name: "sim",
    version: "1.0.0",

};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const input = args.join(" ");
  
    if (!input) {
      api.sendMessage("Usage: sim [ text ]", event.threadID, event.messageID);
      return;
    }
    try {  
        const content = encodeURIComponent(input);
        const response = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=ph&message=${content}&filter=false`);
        const respond = response.data.success;
        if (res.data.error) {
            api.sendMessage(`Error please try again later.`, event.threadID, (error, info) => {
                if (error) {
                    
                }
            }, event.messageID);
        } else {
            api.sendMessage(respond, event.threadID, (error, info) => {
                if (error) {
                   
                }
            }, event.messageID);
        }
    } catch (error) {

        api.sendMessage("An error occurred while fetching the data.", event.threadID, event.messageID);
    }
};

const kazumaAI = require("axios");

module.exports.config = {
  name: "adobo",
  version: "2.7.5",
};

let lastResponse = "";

module.exports.run = async function ({ api, event, args }) {
  let { threadID, messageID, senderID } = event;
  const getUserInfo = async (api, userID) => {
    try {
      const userInfo = await api.getUserInfo(userID);
      return userInfo[userID].name;
    } catch (error) {
      console.error(`Error fetching user info: ${error}`);
      return "";
    }
  };
  
  try {
    if (args.length === 0) {
      const greetings = ["Howdy", "Hello", "Hi", "What's up", "Hey", "Yo", "Konnichiwa", "Oy", "Yow", "Ohh", "Greetings", "konbanwa", "Zup", "Hola", "Bonjour", "Eyow", "Namaste"];

      const randomRespond = ["What's your question pare?", "How may assist you today?", "How can I help you?", "Do you have a question?", "How can I assist you?", "Is there anything I can help you with today?", "What can I do for you today?", "What can I help you with?", "How can I help?", "Do you have another question? Please let me know.", "Is there anything else you'd like my help with?", "May I be of further assistance?", "Is there anything else I can help you with today?", "Is there anything else I can do for you?", "If I can do anything else for you, please let me know.", "Is there anything else on your mind that I can help you with?", "Is there anything else I can do to help?", "Let me know if you have any other questions.", "Please feel free to reach out if you have any questions.", "Don't hesitate to ask if you have any questions.", "I'd be happy to clarify anything for you.", "I'm happy to answer any questions you have.", "Please let me know if there's anything else I can help you with.", "I'm happy to help in any way I can, so please let me know if you have any questions.", "I'm always here to help, so please don't hesitate to ask.", "Is there anything I can clarify for you?", "Is there anything I can help you understand better?", "Is there anything I can do for you?", "I am always happy to help in any way I can. Please let me know that you would like me to do.", "May I help you?", "How may assist you?", "Is there something I can help you with?", "Let me know if there's anything I can do.", "I'm here to help if you need anything.", "May I be of assistance?", "How can I make your day better?", "I'm glad to help.", "Is there anything I can do to make this easier for you?", "I'm here for you.", "I'm always willing to lend a hand.", "I'm glad I can be of assistance.", "I'm happy to help out.", "Whatever you need, just ask."];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      const randomRespondK = randomRespond[Math.floor(Math.random() * randomRespond.length)];

      const userInfo = await getUserInfo(api, senderID);

    api.sendMessage({ body: `${randomGreeting} ${userInfo}, ${randomRespondK}`, mentions: [{ tag: userInfo, id: senderID }] }, threadID, messageID);
      return;
      }

    const response = args.join(" ");

    if (response === lastResponse) {
    api.sendMessage("inulit mo lang tanong mo ehh 😼", threadID, messageID);
    return;
  } else {
    lastResponse = response;
    }

    api.setMessageReaction("🚀", event.messageID, (err) => {}, true);
    api.sendMessage(`𝘼𝙙𝙤𝙗𝙤𝙎𝙚𝙖𝙧𝙘𝙝𝙞𝙣𝙜🔎: ${response}`, threadID, messageID);

    const r = await KazumaAI.get(`https://ashleyapi.cyclic.app/api/gpt?query=${response}`);
    const kazuma = r.data.result;

    const c = "credits: www.facebook.com/markqtypie";

    const finalResponse = `${kazuma}`;

    api.sendMessage(finalResponse, threadID, messageID)
  } catch (error) {
    console.log("API error:", error);
    api.sendMessage("We apologize for the inconvenience, but we were unable to send your answer at this time. Please try again later.", threadID, messageID);
  }
  }

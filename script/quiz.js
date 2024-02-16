module.exports.config = {
  name: "quiz",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  credits: "Developer",
  description: "Quiz's game earn money in quiz",
  usage: "quiz",
  cooldown: 0,
};
module.exports.run = async function({
  api,
  event,
  args,
  Utils
}) {
  const axios = require('axios');
  const {
    question,
    answer
  } = (await axios.get('https://quiz-6rhj.onrender.com/api/quiz/qz?category=english')).data;
  api.sendMessage(question, event.threadID, function(err, info) {
    return Utils.handleReply.push({
      type: "quiz",
      author: event.senderID,
      messageID: info.messageID,
      answer: answer.toLowerCase()
    });
  });
};
module.exports.handleReply = async function({
  api,
  event,
  Utils,
  Currencies
}) {
  const {
    threadID,
    messageID,
    body
  } = event;
  const reply = Utils.handleReply.findIndex(reply => reply.author === event.senderID);
  const handleReply = Utils.handleReply[reply];
  if (handleReply.messageID !== event.messageReply.messageID) {
    return;
  }
  switch (handleReply.type) {
    case "quiz": {
      const choices = ["a", "b", "c", "d"];
      if (!choices.includes(body.toLowerCase())) {
        return api.sendMessage("Invalid choice. Please select one of the following options: a, b, c, or d.", threadID, messageID);
      }
      api.unsendMessage(Utils.handleReply[reply].messageID);
      if (body?.toLowerCase() === Utils.handleReply[reply].answer) {
        await Currencies.increaseMoney(event.senderID, 500);
        api.sendMessage(`You win and gain 500`, threadID, messageID);
        Utils.handleReply.splice(reply, 1);
      } else {
        api.sendMessage(`You lose the correct answer is ${Utils.handleReply[reply].answer}`, threadID, messageID);
        Utils.handleReply.splice(reply, 1);
      }
      break;
    }
  }
};

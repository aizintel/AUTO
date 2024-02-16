const axios = require("axios");
module.exports.config = {
  name: "horse",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Bet on a horse race.",
  usage: "horse [black/red/yellow/green/pink] [amount]",
  credits: "Developer",
  cooldown: 0
};
module.exports.run = async ({
  api,
  event,
  args,
  Currencies
}) => {
  const {
    threadID,
    messageID,
    senderID
  } = event;
  const choices = ["black", "red", "yellow", "green", "pink"];
  if (!args[0] || !choices.includes(args[0])) {
    api.sendMessage('Invalid choice. Please select one of the following colors: "black", "red", "yellow", "green", "pink". Please try again.', threadID, messageID);
    return;
  }
  if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
    api.sendMessage('Invalid amount. Please specify a valid amount to bet.', threadID, messageID);
    return;
  }
  const userData = await Currencies.getData(senderID);
  const userMoney = userData.money;
  if (userMoney < 100) {
    return api.sendMessage('Your balance is less than 100, not enough to play', threadID, messageID);
  } else if (userMoney < args[1]) {
    return api.sendMessage(`Your balance is not enough to place this bet`, threadID, messageID);
  }
  const selectedColor = choices[Math.floor(Math.random() * choices.length)];
  const amount = parseInt(args[1]);
  let image;
  try {
    const response = await axios.get("https://imgur.com/or4ox3W.gif", {
      responseType: "stream"
    });
    image = response.data;
  } catch (error) {
    console.error("Error fetching horse race image:", error);
    return api.sendMessage("Apologies, there was an error processing the race. Please try again later.", threadID, messageID);
  }
  const messageToSend = {
    body: 'Please wait for the result...',
    attachment: image
  };
  api.sendMessage(messageToSend, event.threadID, async (err, info) => {
    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
    if (selectedColor === args[0]) {
      await Currencies.increaseMoney(senderID, amount * 2);
      api.sendMessage(`Congratulations! Your chosen horse (${selectedColor}) won, and you received ${amount * 2} money. Your total balance is now ${userMoney + (amount * 2)}.`, threadID, messageID);
    } else {
      await Currencies.decreaseMoney(senderID, amount);
      api.sendMessage(`Unfortunately, your chosen horse (${selectedColor}) didn't win. You lost ${amount} money. Your total balance is now ${userMoney - amount}.`, threadID, messageID);
    }
  });
};

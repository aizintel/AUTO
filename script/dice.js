module.exports.config = {
  name: "dice",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Bet on the outcome of rolling a six-sided dice.",
  usage: "dice [1-6] [amount]",
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
  const choices = ["1", "2", "3", "4", "5", "6"];
  if (!args[0] || !choices.includes(args[0])) {
    api.sendMessage('Invalid choice. Please select a number between 1 and 6.', threadID, messageID);
    return;
  }
  if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
    api.sendMessage('Invalid amount. Please specify a valid amount to bet.', threadID, messageID);
    return;
  }
  const userData = await Currencies.getData(senderID);
  const userMoney = userData.money;
  const selectedNumber = parseInt(args[0]);
  const amount = parseInt(args[1]);
  if (userMoney < amount) {
    return api.sendMessage(`Your balance is not enough to place this bet`, threadID, messageID);
  }
  const rolledNumber = Math.floor(Math.random() * 6) + 1;
  let winnings = 0;
  let resultMessage = '';
  if (selectedNumber === rolledNumber) {
    winnings = amount * 5;
    resultMessage = `Congratulations! You guessed the correct number (${selectedNumber}) and won ${winnings} credits.`;
  } else {
    winnings = -amount;
    resultMessage = `Sorry, you guessed wrong. The rolled number was ${rolledNumber}. You lost ${amount} credits.`;
  }
  const newBalance = userMoney + winnings;
  if (winnings > 0) {
    await Currencies.increaseMoney(senderID, winnings);
  } else if (winnings < 0) {
    await Currencies.decreaseMoney(senderID, -winnings);
  }
  api.sendMessage(resultMessage + ` Your new balance is ${newBalance}.`, threadID, messageID);
};

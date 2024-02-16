module.exports.config = {
  name: "rps",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Play rock-paper-scissors and bet on the outcome.",
  usage: "rps [rock/paper/scissors] [amount]",
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
  const choices = ["rock", "paper", "scissors"];
  if (!args[0] || !choices.includes(args[0])) {
    api.sendMessage('Invalid choice. Please select one of the following: "rock", "paper", "scissors". Please try again.', threadID, messageID);
    return;
  }
  if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
    api.sendMessage('Invalid amount. Please specify a valid amount to bet.', threadID, messageID);
    return;
  }
  const userData = await Currencies.getData(senderID);
  const userMoney = userData.money;
  if (userMoney < args[1]) {
    return api.sendMessage(`Your balance is not enough to place this bet`, threadID, messageID);
  }
  const selectedChoice = choices[Math.floor(Math.random() * choices.length)];
  const amount = parseInt(args[1]);
  const result = determineWinner(args[0], selectedChoice);
  let winnings = 0;
  switch (result) {
    case 'win':
      winnings = amount;
      break;
    case 'lose':
      winnings = -amount;
      break;
    default:
      winnings = 0;
      break;
  }
  const newBalance = userMoney + winnings;
  if (winnings > 0) {
    await Currencies.increaseMoney(senderID, winnings);
  } else if (winnings < 0) {
    await Currencies.decreaseMoney(senderID, -winnings);
  }
  api.sendMessage(`You chose ${args[0]} and the bot chose ${selectedChoice}. ${getOutcomeMessage(result, amount, winnings)}. Your new balance is ${newBalance}.`, threadID, messageID);
};

function determineWinner(playerChoice, botChoice) {
  if (playerChoice === botChoice) {
    return 'tie';
  } else if (
    (playerChoice === 'rock' && botChoice === 'scissors') || (playerChoice === 'paper' && botChoice === 'rock') || (playerChoice === 'scissors' && botChoice === 'paper')) {
    return 'win';
  } else {
    return 'lose';
  }
}

function getOutcomeMessage(result, amount, winnings) {
  switch (result) {
    case 'win':
      return `Congratulations! You won ${amount} credits.`;
    case 'lose':
      return `Unfortunately, you lost ${amount} credits.`;
    case 'tie':
      return 'It\'s a tie!';
    default:
      return '';
  }
}

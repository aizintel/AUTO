module.exports.config = {
  name: "slot",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Try your luck with a slot machine.",
  usage: "slot [bet]",
  credits: "Developer",
  cooldown: 0
};
module.exports.run = async function({
  api,
  event,
  args,
  Currencies
}) {
  const {
    threadID,
    messageID,
    senderID
  } = event;
  const {
    getData,
    increaseMoney,
    decreaseMoney
  } = Currencies;
  const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
  const userCurrency = await getData(senderID);
  if (!userCurrency || typeof userCurrency !== 'object') {
    return;
  }
  const userBalance = userCurrency.money;
  const betAmount = parseInt(args[0]);
  if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage('[ SLOT ] Please enter a valid bet amount.', threadID, messageID);
  if (betAmount > userBalance) return api.sendMessage('[ SLOT ] You do not have enough balance to place this bet.', threadID, messageID);
  const slotResult = [];
  for (let i = 0; i < 3; i++) {
    slotResult[i] = Math.floor(Math.random() * slotItems.length);
  }
  let winnings = 0;
  let winMessage = '';
  if (slotResult[0] === slotResult[1] && slotResult[1] === slotResult[2]) {
    winnings = betAmount * 9;
    winMessage = '🎉 Congratulations! You hit the jackpot!';
  } else if (slotResult[0] === slotResult[1] || slotResult[0] === slotResult[2] || slotResult[1] === slotResult[2]) {
    winnings = betAmount * 2;
    winMessage = '🎉 Congratulations! You won!';
  } else {
    winnings = -betAmount;
    winMessage = '💔 Sorry, you didn\'t win this time.';
  }
  const newBalance = userBalance + winnings;
  if (winnings > 0) {
    await increaseMoney(senderID, winnings);
  } else {
    await decreaseMoney(senderID, -winnings);
  }
  api.sendMessage(`🎰 ${slotItems[slotResult[0]]} | ${slotItems[slotResult[1]]} | ${slotItems[slotResult[2]]}. ${winMessage} You ${winnings >= 0 ? 'won' : 'lost'} ${Math.abs(winnings)} credits. Your new balance is ${newBalance}.`, threadID, messageID);
}

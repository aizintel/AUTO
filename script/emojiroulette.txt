module.exports.config = {
    name: "emojiroulette",
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Bet on your favorite emoji and see if you win!",
    usage: "emojiroulette [emoji] [amount]",
    credits: "Developer",
    cooldown: 0
};

module.exports.run = async ({ api, event, args, Currencies }) => {
    const { threadID, messageID, senderID } = event;

    const emojis = ["😀", "😂", "😍", "😎", "🥳", "😊", "🤩", "😜", "🤔", "🥺"];

    if (!args[0] || !emojis.includes(args[0])) {
        api.sendMessage(`Invalid emoji. Please select one of the following emojis to bet on: ${emojis.join(", ")}.`, threadID, messageID);
        return;
    }

    if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
        api.sendMessage('Invalid amount. Please specify a valid amount to bet.', threadID, messageID);
        return;
    }

    const userData = await Currencies.getData(senderID);
    const userMoney = userData.money;

    const selectedEmoji = args[0];
    const amount = parseInt(args[1]);

    if (userMoney < amount) {
        return api.sendMessage(`Your balance is not enough to place this bet`, threadID, messageID);
    }

    const winningEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    let winnings = 0;
    let resultMessage = '';

    if (selectedEmoji === winningEmoji) {
        winnings = amount * 2; 
        resultMessage = `🎉 Congratulations! ${winningEmoji} is the winning emoji! You won ${winnings} credits.`;
    } else {
        winnings = -amount; 
        resultMessage = `😔 Sorry, ${winningEmoji} is the winning emoji. You lost ${amount} credits.`;
    }

    const newBalance = userMoney + winnings;

    if (winnings > 0) {
        await Currencies.increaseMoney(senderID, winnings);
    } else if (winnings < 0) {
        await Currencies.decreaseMoney(senderID, -winnings);
    }

    api.sendMessage(resultMessage + ` Your new balance is ${newBalance}.`, threadID, messageID);
};

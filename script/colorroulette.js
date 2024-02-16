module.exports.config = {
    name: "colorroulette",
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Bet on your favorite color and see if you win!",
    usage: "colorroulette [color] [amount]",
    credits: "Developer",
    cooldown: 0
};

module.exports.run = async ({ api, event, args, Currencies }) => {
    const { threadID, messageID, senderID } = event;

    const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink"];

    if (!args[0] || !colors.includes(args[0])) {
        api.sendMessage(`Invalid color. Please select one of the following colors to bet on: ${colors.join(", ")}.`, threadID, messageID);
        return;
    }

    if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
        api.sendMessage('Invalid amount. Please specify a valid amount to bet.', threadID, messageID);
        return;
    }

    const userData = await Currencies.getData(senderID);
    const userMoney = userData.money;

    const selectedColor = args[0];
    const amount = parseInt(args[1]);

    if (userMoney < amount) {
        return api.sendMessage(`Your balance is not enough to place this bet`, threadID, messageID);
    }

    const winningColor = colors[Math.floor(Math.random() * colors.length)];

    let winnings = 0;
    let resultMessage = '';

    if (selectedColor === winningColor) {
        winnings = amount * 3; 
        resultMessage = `🎉 Congratulations! ${winningColor} is the winning color! You won ${winnings} credits.`;
    } else {
        winnings = -amount; 
        resultMessage = `😔 Sorry, ${winningColor} is the winning color. You lost ${amount} credits.`;
    }

    const newBalance = userMoney + winnings;

    if (winnings > 0) {
        await Currencies.increaseMoney(senderID, winnings);
    } else if (winnings < 0) {
        await Currencies.decreaseMoney(senderID, -winnings);
    }

    api.sendMessage(resultMessage + ` Your new balance is ${newBalance}.`, threadID, messageID);
};

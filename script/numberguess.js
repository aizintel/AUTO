module.exports.config = {
    name: "numberguess",
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Bet on guessing a randomly generated number.",
    usage: "numberguess [number] [amount]",
    credits: "Developer",
    cooldown: 0
};

module.exports.run = async ({ api, event, args, Currencies }) => {
    const { threadID, messageID, senderID } = event;

    if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) {
        api.sendMessage('Invalid number. Please specify a valid number to guess.', threadID, messageID);
        return;
    }

    if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
        api.sendMessage('Invalid amount. Please specify a valid amount to bet.', threadID, messageID);
        return;
    }

    const userData = await Currencies.getData(senderID);
    const userMoney = userData.money;

    const guessedNumber = parseInt(args[0]);
    const amount = parseInt(args[1]);

    if (userMoney < amount) {
        return api.sendMessage(`Your balance is not enough to place this bet`, threadID, messageID);
    }

    const randomNumber = Math.floor(Math.random() * 100) + 1; 

    let winnings = 0;
    let resultMessage = '';

    if (guessedNumber === randomNumber) {
        winnings = amount * 10; 
        resultMessage = `Congratulations! You guessed the correct number (${randomNumber}) and won ${winnings} credits.`;
    } else {
        winnings = -amount; 
        resultMessage = `Sorry, the correct number was ${randomNumber}. You lost ${amount} credits.`;
    }

    const newBalance = userMoney + winnings;

    if (winnings > 0) {
        await Currencies.increaseMoney(senderID, winnings);
    } else if (winnings < 0) {
        await Currencies.decreaseMoney(senderID, -winnings);
    }

    api.sendMessage(resultMessage + ` Your new balance is ${newBalance}.`, threadID, messageID);
};

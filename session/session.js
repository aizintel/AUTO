const crypto = require('crypto');

function generateSessionCode() {
    const sessionCodeLength = 8; 
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sessionCode = '';

    for (let i = 0; i < sessionCodeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        sessionCode += characters[randomIndex];
    }

    return sessionCode;
}

const sessionCode = generateSessionCode();
console.log('Generated Session Code:', sessionCode);

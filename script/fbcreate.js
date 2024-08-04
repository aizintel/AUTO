const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");

module.exports = {
 config: {
 name: "fbcreate",
 version: "1.0.0",
 hasPermission: 0,
 credits: "Developer",
 description: "Create Facebook accounts using randomly generated email addresses.",
 usage: "{pn} fbcreate <amount>",
 usePrefix: true,
 commandCategory: "Utilities",
 cooldowns: 0,
 },

 async run({ api, event, args }) {
 try {
 const threadID = event.threadID;
 const senderID = event.senderID;
 const amount = parseInt(args[0], 10);

 if (isNaN(amount) || amount <= 0) {
 return api.sendMessage("❌ Invalid number of accounts requested. Please specify a positive integer.", threadID);
 }

 api.sendMessage(`🚀 Creating ${amount} Facebook account(s)... Please wait.`, threadID);

 const accounts = [];
 for (let i = 0; i < amount; i++) {
 const account = await createMailTmAccount();
 if (account) {
 const regData = await registerFacebookAccount(account.email, account.password, account.firstName, account.lastName, account.birthday);
 if (regData) {
 accounts.push({
 email: account.email,
 password: account.password,
 firstName: account.firstName,
 lastName: account.lastName,
 birthday: account.birthday.toISOString().split('T')[0],
 gender: regData.gender,
 userId: regData.new_user_id,
 token: regData.session_info.access_token,
 });
 } else {
 api.sendMessage(`⚠️ Failed to register account: ${account.email}`, threadID);
 }
 } else {
 api.sendMessage(`⚠️ Failed to create email for account ${i + 1}.`, threadID);
 }
 }

 if (accounts.length > 0) {
 let resultMessage = `🎉 Accounts created successfully:\n`;
 accounts.forEach((acc, index) => {
 resultMessage += `\n${index + 1}: ${acc.firstName} ${acc.lastName} - ${acc.email} (Password: ${acc.password})`;
 });
 api.sendMessage(resultMessage, threadID);
 } else {
 api.sendMessage("❌ No accounts were created successfully.", threadID);
 }
 } catch (error) {
 console.error(error);
 return api.sendMessage("❌ An error occurred while creating Facebook accounts. Please try again.", event.threadID);
 }
 },
};

const genRandomString = (length) => {
 const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 let result = '';
 for (let i = 0; i < length; i++) {
 result += characters.charAt(Math.floor(Math.random() * characters.length));
 }
 return result;
};

const getRandomDate = (start, end) => {
 return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomName = () => {
 const names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Laura', 'Robert', 'Emily', 'William', 'Emma'];
 const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
 return {
 firstName: names[Math.floor(Math.random() * names.length)],
 lastName: surnames[Math.floor(Math.random() * surnames.length)],
 };
};

const getMailDomains = async () => {
 const url = 'https://api.mail.tm/domains';
 try {
 const response = await axios.get(url);
 return response.data['hydra:member'];
 } catch (error) {
 console.error(`[×] E-mail Error: ${error}`);
 return null;
 }
};

const createMailTmAccount = async () => {
 const mailDomains = await getMailDomains();
 if (mailDomains) {
 const domain = mailDomains[Math.floor(Math.random() * mailDomains.length)].domain;
 const username = genRandomString(10);
 const password = genRandomString(12);
 const birthday = getRandomDate(new Date(1976, 0, 1), new Date(2004, 0, 1));
 const { firstName, lastName } = getRandomName();
 const url = 'https://api.mail.tm/accounts';
 const data = { address: `${username}@${domain}`, password: password };
 try {
 const response = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
 if (response.status === 201) {
 console.log(`[✓] E-mail Created: ${username}@${domain}`);
 return { email: `${username}@${domain}`, password, firstName, lastName, birthday };
 } else {
 console.error(`[×] Email Error: ${response.data}`);
 return null;
 }
 } catch (error) {
 console.error(`[×] Error: ${error}`);
 return null;
 }
 } else {
 return null;
 }
};

const registerFacebookAccount = async (email, password, firstName, lastName, birthday) => {
 const api_key = '882a8490361da98702bf97a021ddc14d';
 const secret = '62f8ce9f74b12f84c123cc23437a4a32';
 const gender = Math.random() < 0.5 ? 'M' : 'F';
 const req = {
 api_key: api_key,
 attempt_login: true,
 birthday: birthday.toISOString().split('T')[0],
 client_country_code: 'EN',
 fb_api_caller_class: 'com.facebook.registration.protocol.RegisterAccountMethod',
 fb_api_req_friendly_name: 'registerAccount',
 firstname: firstName,
 format: 'json',
 gender: gender,
 lastname: lastName,
 email: email,
 locale: 'en_US',
 method: 'user.register',
 password: password,
 reg_instance: genRandomString(32),
 return_multiple_errors: true,
 };
 const sig = Object.keys(req).sort().map(k => `${k}=${req[k]}`).join('') + secret;
 const ensig = crypto.createHash('md5').update(sig).digest('hex');
 req.sig = ensig;

 const api_url = 'https://b-api.facebook.com/method/user.register';
 try {
 const response = await axios.post(api_url, new URLSearchParams(req), {
 headers: { 'User-Agent': '[FBAN/FB4A;FBAV/35.0.0.48.273;FBDM/{density=1.33125,width=800,height=1205};FBLC/en_US;FBCR/;FBPN/com.facebook.katana;FBDV/Nexus 7;FBSV/4.1.1;FBBK/0;]' }
 });
 const reg = response.data;
 console.log(`Registration Success`);
 return reg;
 } catch (error) {
 console.error(`[×] Registration Error: ${error}`);
 return null;
 }
};

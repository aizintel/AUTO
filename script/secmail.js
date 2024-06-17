const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    description: 'Manage temporary email using 1secmail API',
    role: 'user',
    cooldown: 3,
    execute: async function(api, event, args) {
        const command = args[0];
        const argument = args[1];

        const userDataDir = path.join(__dirname, '..', 'database', 'users');
        const uid = event.senderID;
        const userFilePath = path.join(userDataDir, `${uid}.json`);

        const createDir = async (dir) => {
            try {
                await fs.mkdir(dir, { recursive: true });
            } catch (error) {
                console.error('Error creating directory:', error);
            }
        };

        const readUserData = async () => {
            try {
                const data = await fs.readFile(userFilePath, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                return {};
            }
        };

        const writeUserData = async (data) => {
            try {
                await fs.writeFile(userFilePath, JSON.stringify(data, null, 2), 'utf8');
            } catch (error) {
                console.error('Error writing user data:', error);
            }
        };

        if (!command) {
            // Show the user's email and forward email
            try {
                const userData = await readUserData();
                const email = userData.email;
                const forwardEmail = userData.email_forward;

                if (!email) {
                    api.sendMessage('No temporary email found. Please generate one first.', event.threadID, null, event.messageID);
                } else {
                    let message = `📧 Your temporary email: ${email}`;
                    if (forwardEmail) {
                        message += `\n📧 Your forwarding email: ${forwardEmail}`;
                    }
                    api.sendMessage(message, event.threadID, null, event.messageID);
                }
            } catch (error) {
                console.error(error);
                api.sendMessage('An error occurred while retrieving your email information.', event.threadID, null, event.messageID);
            }
        } else if (command === 'generate') {
            // Generate a new temporary email
            try {
                const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
                const email = response.data[0];

                await createDir(userDataDir);
                const userData = await readUserData();
                userData.email = email;
                await writeUserData(userData);

                api.sendMessage(`📧 Temporary email generated: ${email}`, event.threadID, null, event.messageID);
            } catch (error) {
                console.error(error);
                api.sendMessage('An error occurred while generating the email.', event.threadID, null, event.messageID);
            }
        } else if (command === 'inbox') {
            // Check the inbox for the generated email
            try {
                const userData = await readUserData();
                const email = userData.email;
                const forwardEmail = userData.email_forward;

                if (!email) {
                    api.sendMessage('No temporary email found. Please generate one first.', event.threadID, null, event.messageID);
                    return;
                }

                const [login, domain] = email.split('@');
                const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
                const messages = response.data;

                if (messages.length === 0) {
                    api.sendMessage('📭 Inbox is empty.', event.threadID, null, event.messageID);
                } else {
                    let inboxMessage = '📬 Inbox messages:\n\n';
                    messages.forEach((message) => {
                        inboxMessage += `From: ${message.from}\nSubject: ${message.subject}\nDate: ${message.date}\n\n`;

                        // Forward the message if a forward email is set
                        if (forwardEmail) {
                            axios.post(`https://api.forward-email.org/`, {
                                from: email,
                                to: forwardEmail,
                                subject: `Fwd: ${message.subject}`,
                                text: `From: ${message.from}\nSubject: ${message.subject}\nDate: ${message.date}\n\n${message.body}`
                            }).catch(error => {
                                console.error('Error forwarding email:', error);
                            });
                        }
                    });
                    api.sendMessage(inboxMessage, event.threadID, null, event.messageID);
                }
            } catch (error) {
                console.error(error);
                api.sendMessage('An error occurred while fetching the inbox.', event.threadID, null, event.messageID);
            }
        } else if (command === 'forward' && argument) {
            // Set the forward email
            try {
                await createDir(userDataDir);
                const userData = await readUserData();
                userData.email_forward = argument;
                await writeUserData(userData);

                api.sendMessage(`📧 Forwarding address set to: ${argument}`, event.threadID, null, event.messageID);
            } catch (error) {
                console.error(error);
                api.sendMessage('An error occurred while setting the forward address.', event.threadID, null, event.messageID);
            }
        } else {
            api.sendMessage('Invalid command. Use "generate" to create a new temporary email, "inbox" to check the inbox, or "forward [email]" to set an email forwarding address.', event.threadID, null, event.messageID);
        }
    }
};

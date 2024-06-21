module.exports = {
    description: "Automatically accept pending threads",
    role: "botadmin",
    credits: "Rejard",
   cooldown: 10, 
    async execute(api, event, args, commands) {
        const list = [
            ...(await api.getThreadList(1, null, ['PENDING'])),
            ...(await api.getThreadList(1, null, ['OTHER'])),
        ];
        if (list[0]) {
            list.forEach(thread => {
                api.sendMessage('Congrats! this Thread has been approved by botadmin u can now use our bot type !help to see all the cmds thanks 👍', thread.threadID);
            });
           api.sendMessage("Threads Accepted Successfully.", event.threadID, event.messageID);
        } else {
            api.sendMessage("There are no pending thread requests.", event.threadID, event.messageID);
        }
    }
};

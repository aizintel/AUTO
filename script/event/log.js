module.exports.config = {
	name: "log",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "Mirai Team",
	description: "Ghi lại thông báo các hoạt đông của bot!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;
  let { threadName, participantIDs, imageSrc } = await api.getThreadInfo(event.threadID);
  const moment = require('moment-timezone');
  var deku = moment.tz("Asia/Manila").format("MM/DD/YYYY");
  var o = moment.tz("Asia/Manila").format("HH:mm:ss");
  const res = await api.getUserInfoV2(event.author);
    var formReport =  `•——Bot Notification——•\n\nDate Now: ${deku}\n\n»Group ID: ${event.threadID}\n\n»Group Name: ${threadName}\n\nAuthor Facebook: https://facebook.com/${event.author}` +"\n\n»Action: {task} " + `at time ${o}` +`\n\n» Action created by: ${res.name}\n\n»This group have ${participantIDs.length} members`,
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name
            task = "User changes group name from: '" + oldName + "' Fort '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "User added bot to a new group";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId== api.getCurrentUserID()) task = "User kicked bot out of group"
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport
    .replace(/\{task}/g, task);

    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) return logger(formReport, "[ Logging Event ]");
    });
}
module.exports.config = {
 name: "leave",
 version: "1.0.0",
};

module.exports.run = async function({ api, event, Users, Threads }) {
 if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
 const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
 const { join } =  global.nodemodule["path"];
 const axios = global.nodemodule["axios"];
 const request = global.nodemodule["request"];
 const fs = global.nodemodule["fs-extra"];
 const { threadID } = event;
 const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
 const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
 const type = (event.author == event.logMessageData.leftParticipantFbId) ? "Left the Group... " : "\nKicked by Administrator.";
 const membersCount = await api.getThreadInfo(threadID).then(info => info.participantIDs.length);

 let msg = `administrator removed ${name} from the group. There are now ${membersCount} members in the group.`;

 var link = ["https://i.imgur.com/dVw3IRx.gif"];
 var callback = () => api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + "/cache/randomly.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/randomly.gif"));
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/randomly.gif")).on("close", () => callback());
}

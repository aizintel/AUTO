module.exports.config = {
  name: "autotiktokdl",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "libyzxy0",
  description: "listen events",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {

   const fs = require('fs');
   const axios = require('axios');

   const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
										const link = event.body;
								
    if (regEx_tiktok.test(link)) {
    
    api.setMessageReaction("⏳", event.messageID, () => { }, true);
   api.sendTypingIndicator(event.threadID, true);
   axios.post(`https://www.tikwm.com/api/`, {
										url: link
										}).then(async response => { // Added async keyword
    
    api.sendMessage('Downloading...', event.threadID, (err, info) =>

   setTimeout(() => {
    api.unsendMessage(info.messageID) 
  }, 10000), event.messageID);
										const data = response.data.data;
       
     const userName = data.author.unique_id;
       
    const userNickname = data.author.nickname;
       
    const userID = data.author.id;
    
    const duration = data.duration
										const videoStream = await axios({
										method: 'get',
										url: data.play,
										responseType: 'stream'
										}).then(res => res.data);
										const fileName = `${Date.now()}.mp4`;
										const filePath = `./${fileName}`;
									     const videoFile = fs.createWriteStream(filePath);											videoStream.pipe(videoFile);
								videoFile.on('finish', () => {
									videoFile.close(() => {	                                      
     setTimeout(function() {
                                        api.setMessageReaction("✅", event.messageID, () => { }, true);                                     api.sendMessage({			
                                            body: `Downloaded Successfull(y). \n\nuserName : \n\n@${userName} \n\nuserNickname : \n\n${userNickname} \n\nuserID : \n\n${userID} \n\nDuration : \n\n${duration}`,																attachment: fs.createReadStream(filePath)
															}, event.threadID, () => {
																fs.unlinkSync(filePath);  // Delete the video file after sending it
											               });
               
                }, 5000);
														});
													});
												}).catch(error => {													api.sendMessage(`error: ${error.message}`, event.threadID, event.messageID);
											});
										}
}

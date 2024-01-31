module.exports.config = {
    name: "resend",
    version: "1.0.0",
    
};
var msgData = {} 

module.exports.handleEvent = async function ({ api, event }) {
  if(event.type == 'message') {
    msgData[event.messageID] = {
      body: event.body, 
      attachments: event.attachments
    }

  }
  if(event.type == "message_unsend" && msgData.hasOwnProperty(event.messageID)) { 
const info = await api.getUserInfo(event.senderID);
const name = info[event.senderID].name
    const axios = require('axios');
    const fs = require("fs")
    if(msgData[event.messageID].attachments.length === 0) {
        api.sendMessage(`${name} unsent this message: ${msgData[event.messageID].body}`, event.threadID)  
    } else if(msgData[event.messageID].attachments[0].type == 'photo')  {   
      var photo = []
      var del = []
      for (const item of msgData[event.messageID].attachments) {
       let { data } = await axios.get(item.url, {responseType: "arraybuffer"})
          fs.writeFileSync(`./script/cache/${item.filename}.jpg`, Buffer.from(data))
          photo.push(fs.createReadStream(`./script/cache/${item.filename}.jpg`))
          del.push(`./script/cache/${item.filename}.jpg`)
      }
                    api.sendMessage({body:`${name} unsent this photo: ${msgData[event.messageID].body}`, attachment: photo}, event.threadID, () => {
               for (const item of del) fs.unlinkSync(item)
             }) 

} else if (msgData[event.messageID].attachments[0].type == 'audio') { 

let { data } = await axios.get(msgData[event.messageID].attachments[0].url, {responseType: "arraybuffer"})

 fs.writeFileSync(`./script/cache/audio.mp3`, Buffer.from(data)) 

api.sendMessage({body:`${name} unsent this voice message: ${msgData[event.messageID].body}`, attachment: fs.createReadStream('./script/cache/audio.mp3')}, event.threadID, () => {
     fs.unlinkSync('./script/cache/audio.mp3')
             });

    } else if (msgData[event.messageID].attachments[0].type == 'animated_image') {

 let { data } = await axios.get(msgData[event.messageID].attachments[0].previewUrl, {responseType: "arraybuffer"})

 fs.writeFileSync(`./script/cache/animated_image.gif`, Buffer.from(data)) 

api.sendMessage({body:`${name} unsent this gif: ${msgData[event.messageID].body}`, attachment: fs.createReadStream('./script/cache/animated_image.gif')}, event.threadID, () => {
     fs.unlinkSync('./script/cache/animated_image.gif')
             });     
    }
  }
}

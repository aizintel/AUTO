function convert(time){
  var date = new Date(`${time}`);
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var formattedDate = `${ day < 10 ? "0" + day : day}` + "/" +`${ month < 10 ? "0" + month : month}` + "/" + year + "||" + `${ hours < 10 ? "0" + hours : hours}` + ":" + `${ minutes < 10 ? "0" + minutes : minutes}` + ":" + `${ seconds < 10 ? "0" + seconds : seconds}`;
return formattedDate;
};

module.exports.config = {
    name: "stalk",
    version: "2.0.0",
    role: 0,
    credits: "cliff",
   aliases: ["stalk someone"],
  cooldown: 0,
  hasPrefix: false,
  usage: "",
  };
module.exports.run = async function({ api, event, args }) {
const request = require("request");
const axios = require("axios");
const fs = require("fs");
let path = __dirname + `/cache/info.png`;

  if (args.join().indexOf('@') !== -1){ var id = Object.keys(event.mentions) }
      else var id = args[0] || event.senderID;
      if(event.type == "message_reply") { var id = event.messageReply.senderID }
  try{
const resp = await axios.get(`http://eu4.diresnode.com:3588/stalk?uid=${id}`)
   var name = resp.data.name;
   var link_profile = resp.data.link;
   var uid = resp.data.id;
   var first_name = resp.data.first_name;
   var username = resp.data.username || "No data!";
   var created_time = convert(resp.data.created_time);
   var web = resp.data.website || "No data!";
   var gender = resp.data.gender;
   var relationship_status = resp.data.relationship_status || "No data!";
   var love = resp.data.significant_other || "No data!";
   var bday = resp.data.birthday || "No data!";
   var follower = resp.data.subscribers.summary.total_count || "No data!";
   var is_verified = resp.data.is_verified;
   var quotes = resp.data.quotes || "No data!";
   var about = resp.data.about || "No data!";
  var locale = resp.data.locale || "No data!";
   var hometown = !!resp.data.hometown?resp.data.hometown.name:"No Hometown";
   var cover = resp.data.source || "No Cover photo";
  var avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`;
//callback
let cb = function() {
api.sendMessage({ body: `•——INFORMATION——•
Name: ${name}
First name: ${first_name}
Creation Date: ${created_time}
Profile link: ${link_profile}
Gender: ${gender}
Relationship Status: ${relationship_status}
Birthday: ${bday}
Follower(s): ${follower}
Verified: ${is_verified}
Hometown: ${hometown}
Locale: ${locale}
•——END——•`, attachment: fs.createReadStream(path)
            }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        };
 request(encodeURI(avatar)).pipe(fs.createWriteStream(path)).on("close", cb);
  } catch (err) {
         api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID)
    }
}
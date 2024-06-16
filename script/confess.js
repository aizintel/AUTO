module.exports.config = {
name: "confess",
version: "1.0.0",
hasPermssion: 0,
credits: "Deku",
description: "Confess to someone",
commandCategory: "...",
usages: "[fb url or uid | message]",
cooldowns: 0
};

module['exports']['run'] = async function({ api, event, args }) {

async function r(m){
api.sendMessage(m, event.threadID, event.messageID)
}


const y = args.join(" ").split("|").map(item => item = item.trim());

var t = y[0]
var t2 = y[1]

if(!args[0] || !t) return r("Missing facebook url or uid");
if(!t2) return r("Missing message");
try {
if(t.startsWith("https://facebook.com")){
  const res = await api.getUID(t)
  var k = res
} else {
  var k = t
}
api.sendMessage(`󰟫╭ 𝗬𝗼𝘂'𝘃𝗲 𝗴𝗼𝘁 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲
 
󰥴 : ${t2}
━━━━━━━━━━━━━━━━━━━━━
• :don't bother me to ask who's the sender‚ you're just wasting your time (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)`, k, () => r("Confession has been sent successfully!"))
} catch (err) {
r("I'm sorry but your confession has been failed to send, I think it's time to chat that person and confess your feelings (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)")
   };
}

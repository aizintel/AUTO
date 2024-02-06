/* 
API BY DEKU
contact: https://facebook.com/joshg101
*/
const {get} = require('axios');
const url = "http://eu4.diresnode.com:3301"; //available model: baymax_gpt, gojo_gpt
module.exports = {
    config: {
        name: "baymax", //rename it if u want
        hasPermssion: 0,
        version: "1.0.0",
        commandCategory: "AI",
        credits: "Deku",
        cooldowns: 0,
        usages: "[ask]/clear to clear history", 
        description: "Talk to BAYMAX 1.2 (with continues conversation)"
    },
    run: async function({api, event, args}){
            let prompt = args.join(' '), id = event.senderID;
             function r(msg){
                 api.sendMessage(msg, event.threadID, event.messageID)
             }

            if(!prompt) return r("Missing input!\n\nIf you want to reset the conversation with "+this.config.name+" you can use “"+this.config.name+" clear”");
            r("🔍…");
            try {
                const res = await get(url+"/baymax_gpt?prompt="+prompt+"&idd="+id);
                return r(res.data.baymax);
            } catch (e){
                return r(e.message)
            }
    }
}
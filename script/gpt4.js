const {get} = require('axios');
const url = "http://eu4.diresnode.com:3301";

module.exports = {
    config: {
        name: 'gpt4',
        version: '1.0.0',
};
    run: async function({api, event, args}){
            let prompt = args.join(' '), id = event.senderID;
           async function r(msg){
                 api.sendMessage(msg, event.threadID, event.messageID)
             }
            if(!prompt) return r("Missing input!\n\nIf you want to reset the conversation with "+this.config.name+" you can use “"+this.config.name+" clear”");
            r("🔍…");
            try {
                const res = await get(url+"/gpt4?prompt="+prompt+"&idd="+id);
                return r(res.data.gpt4);
            } catch (e){
                return r(e.message)
            }
    }
}
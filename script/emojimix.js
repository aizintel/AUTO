const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "emojimix",
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Mix two emojis.",
    usage: "emojimix [emoji1] [emoji2]",
    credits: "Developer",
    cooldown: 0
};

function isValidEmoji(emoji) {
    return emoji.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/);
}


module.exports.run = async ({ api, event, args }) => {

  try {
    
  const { threadID, messageID } = event;
  
  const time = new Date();
  const timestamp = time.toISOString().replace(/[:.]/g, "-");
  const pathPic = __dirname + '/cache/' + `${timestamp}_emojimix.png`;

  if (args.length < 2) {
    api.sendMessage("Please provide two emojis to mix.", threadID, messageID);
    return;
  };
    
    const emoji1 = args[0];
    const emoji2 = args[1];

    if (!isValidEmoji(emoji1) || !isValidEmoji(emoji2)) {
      api.sendMessage("Invalid emojis provided. Please provide valid emojis.", threadID, messageID);
      return;
    }
  
   const { data } = await axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);
  
    const picture = data.results[0].url;
  
    const getPicture = (await axios.get(picture, { responseType: 'arraybuffer' })).data;

    fs.writeFileSync(pathPic, Buffer.from(getPicture, 'utf-8'));

    api.sendMessage({ body: '', attachment: fs.createReadStream(pathPic) }, threadID, () => fs.unlinkSync(pathPic), messageID);

    } catch(error) {
      api.sendMessage("Can't combibe emojis.", threadID, messageID);
    }
};

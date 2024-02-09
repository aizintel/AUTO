const axios = require('axios');
const fs = require('fs');
module.exports.config = {
  name: 'anime',
  version: '1.0.0',
  role: 0,
  hasPrefix: true,
  aliases: ['hanime'],
  description: 'Get a random anime image',
  usage: "Anime [category-type]",
  credits: 'Develeoper',
  cooldown: 5,
};
module.exports.run = async function({
  api,
  event,
  args
}) {
  try {
    const input = args.join(' ');
    if (!input) {
      const message = `Here's the list of anime categories:\n\nCategory: nsfw\nType:\n• waifu\n• neko\n• trap\n• blowjob\n\nCategory: sfw\nType:\n• waifu\n• neko\n• shinobu\n• megumin\n• bully\n• cuddle\n• cry\n• hug\n• awoo\n• kiss\n• lick\n• pat\n• smug\n• bonk\n• yeet\n• blush\n• smile\n• wave\n• highfive\n• handhold\n• nom\n• bite\n• glomp\n• slap\n• kill\n• kick\n• happy\n• wink\n• poke\n• dance\n• cringe\n\nUsage: anime category - type`;
      api.sendMessage(message, event.threadID, event.messageID);
    } else {
      const split = input.split('-').map(item => item.trim());
      const choice = split[0];
      const category = split[1];
      const time = new Date();
      const timestamp = time.toISOString().replace(/[:.]/g, "-");
      const pathPic = __dirname + '/cache/' + `${timestamp}_waifu.png`;
      const {
        data
      } = await axios.get(`https://api.waifu.pics/${choice}/${category}`);
      const picture = data.url;
      const getPicture = (await axios.get(picture, {
        responseType: 'arraybuffer'
      })).data;
      fs.writeFileSync(pathPic, Buffer.from(getPicture, 'utf-8'));
      api.sendMessage({
        body: '',
        attachment: fs.createReadStream(pathPic)
      }, event.threadID, () => fs.unlinkSync(pathPic), event.messageID);
    }
  } catch (error) {
    api.sendMessage(`Error in the anime command: ${error.message}`);
  }
};

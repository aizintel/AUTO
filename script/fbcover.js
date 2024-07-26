module.exports.config = {
  name: "fbcover",
  version: "1.0.",
  hasPermssion: 0,
  credits: "James Lim", // api by Kim Joseph DG Bien - kira
  description: "facebook cover/banner",
  usePrefix: false,
  commandCategory: "banner",
  usages: "name | color | address | email | subname | phone number",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  let { threadID, messageID, senderID } = event;
  let uid = event.senderID;
  let imgPath = __dirname + `/cache/coverfbv2.jpg`;
  const txt = args.join(" ").split("|").map(item => item.trim());
  let name = txt[0];
  let color = txt[1];
  let address = txt[2];
  let email = txt[3];
  let subname = txt[4];
  let number = txt[5];

  if (!args[0]) {
    api.sendMessage(`⚠ 𝚖𝚒𝚜𝚜𝚒𝚗𝚐 𝚒𝚗𝚙𝚞𝚝.\n\n𝚞𝚜𝚊𝚐𝚎: fbcover name | color | address | email | subname | phone number`, threadID, messageID);
    return;
  }

  api.sendMessage(`⏳ 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...\n\nname: ${name}\ncolor: ${color}\naddress: ${address}\nemail: ${email}\nsubname: ${subname}\nphone number: ${number}\nuid: ${uid}`, threadID, messageID);

  try {
    const cover = (await axios.get(`https://hiroshi-rest-api.replit.app/canvas/fbcoverv2?name=${name}&color=${color}&address=${address}&email=${email}&subname=${subname}&sdt=${number}&uid=${uid}`, { responseType: "arraybuffer" })).data;
    
    fs.writeFileSync(imgPath, Buffer.from(cover, "utf-8"));

    api.sendMessage({
      body: "🟢 𝚑𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝚌𝚘𝚟𝚎𝚛 𝚙𝚑𝚘𝚝𝚘:",
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath), messageID);
  } catch (error) {
    console.error("[ FBCOVERV2 ] ERROR!");
    api.sendMessage("🔴 𝚊𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝙵𝙱𝙲𝙾𝚅𝙴𝚁 𝙰𝙿𝙸.", threadID, messageID);
  }
};

const axios = require("axios");
const fs = require("fs");
const path = require("path"); // Import the path module

module.exports = {
  config: {
    name: "remini",
    aliases: [],
    version: "1.0",
    author: "Who's Deku",
    countDown: 5,
    role: 0,
    shortDescription: "Remini filter",
    longDescription: "Remini filter",
    category: "media",
    guide: "{pn} remini / reply to image or image url",
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    
    // Get the current directory using __dirname
    const currentDir = path.resolve(__dirname);

    if (event.type == "message_reply") {
      var t = event.messageReply.attachments[0].url;
    } else {
      var t = args.join(" ");
    }
    
    try {
      api.sendMessage("Generating...", threadID, messageID);

      const r = await axios.get("https://free-api.ainz-sama101.repl.co/canvas/remini?", {
        params: {
          url: encodeURI(t),
        },
      });
      
      const result = r.data.result.image_data;
      
      // Define the path to save the image
      let ly = path.join(currentDir, "cache", "anime.png");

      // Fetch and save the image
      let ly1 = (await axios.get(result, {
        responseType: "arraybuffer",
      })).data;
      fs.writeFileSync(ly, Buffer.from(ly1, "utf-8"));

      // Send the image as an attachment
      api.sendMessage(
        { attachment: fs.createReadStream(ly) },
        threadID,
        () => fs.unlinkSync(ly),
        messageID
      );
    } catch (e) {
      console.log(e.message);
      return api.sendMessage("Something went wrong.\n" + e.message, threadID, messageID);
    }
  },
};
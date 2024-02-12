const axios = require('axios');

let eta = 3;

module.exports = {
  config: {
    name: "4k",
    usePrefix: true,
aliases: ["remining"],
    version: "1.0",
    author: "MarianCross",
    countDown: 5,
    role: 0,
    shortDescription: "remini",
    longDescription: "turn picture into 4K",
    category: "image",
    guide: "{pn} remini"
  },

  onStart: async ({ api, event }) => {
    const axiosInstance = axios.create();

    let send = msg => api.sendMessage(msg, event.threadID, event.messageID);

    if (event.type !== "message_reply") {
      return send("Please reply to an image!");
    }

    send(`Processing image resolution upgrade for ${event.messageReply.attachments.length} image(s) (${event.messageReply.attachments.length * eta}s)`);

    let stream = [];
    let exec_time = 0;

    for (let i of event.messageReply.attachments) {
      try {
        let res = await axiosInstance.get(encodeURI(`https://nams.live/upscale.png?{"image":"${i.url}","model":"4x-UltraSharp"}`), {
          responseType: "stream"
        });

        exec_time += +res.headers.exec_time;
        eta = res.headers.exec_time / 1000 << 0;
        res.data.path = "tmp.png";
        stream.push(res.data);
      } catch (error) {
        console.error(error);
        // Handle the error here, e.g., send an error message or log the error
      }
    }

    send({
      body: `Success (${exec_time / 1000 << 0}s)`,
      attachment: stream
    });
  }
};
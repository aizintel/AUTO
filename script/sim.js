module.exports.config = {
  name: "sim",
  version: "1.0.0",
};
module.exports.run = async function({
  api,
  event,
  args
}) {
  const axios = require("axios");
  let {
    messageID,
    threadID,
    senderID,
    body
  } = event;
  let tid = threadID,
    mid = messageID;
  const content = encodeURIComponent(args.join(" "));
  if (!args[0]) { api.sendMessage("Usage: sim [ text ]", tid, mid) }
  try {
    const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=ph&message=${content}&filter=false`);
    const respond = res.data.success;
    if (res.data.error) {
      api.sendMessage(`Error please try again later.`, tid, (error, info) => {
        if (error) {}
      }, mid);
    } else {
      api.sendMessage(respond, tid, (error, info) => {
        if (error) {}
      }, mid);
    }
  } catch (error) {
    api.sendMessage("An error occurred while fetching the data.", tid, mid);
  }
};

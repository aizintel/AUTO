const axios = require('axios');

module.exports.config = {
  name: 'iplookup',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['iplookup'],
  description: "Fetch and send IP lookup details",
  usage: "iplookup [IP address]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const ip = args.join(" ");

  if (!ip) {
    api.sendMessage('usahe: iplookup <ip>', event.threadID, event.messageID);
    return;
  }

  const chill = await new Promise(resolve => {
    api.sendMessage('LOOK UPING...', event.threadID, (err, info) => {
      resolve(info);
    });
  });

  const apiUrl = `https://joshweb.click/iplu?ip=${encodeURIComponent(ip)}`;

  try {
    const response = await axios.get(apiUrl);
    const result = response.data.result;

    if (result.status !== 'success') {
      api.sendMessage('Error: Unable to retrieve information.', event.threadID, event.messageID);
      return;
    }

    const message = `
      🌐 𝐈𝐏 𝐋𝐨𝐨𝐤𝐮𝐩 𝐑𝐞𝐬𝐮𝐥𝐭𝐬:
      - Continent: ${result.continent} (${result.continentCode})
      - Country: ${result.country} (${result.countryCode})
      - Region: ${result.regionName} (${result.region})
      - City: ${result.city}
      - Zip: ${result.zip}
      - Lat/Lon: ${result.lat}, ${result.lon}
      - Timezone: ${result.timezone} (Offset: ${result.offset})
      - Currency: ${result.currency}
      - ISP: ${result.isp}
      - Organization: ${result.org}
      - AS: ${result.as} (${result.asname})
      - Reverse: ${result.reverse}
      - Mobile: ${result.mobile ? 'Yes' : 'No'}
      - Proxy: ${result.proxy ? 'Yes' : 'No'}
      - Hosting: ${result.hosting ? 'Yes' : 'No'}
      - Query: ${result.query}
    `;

    await api.sendMessage(message.trim(), event.threadID, event.messageID);

  } catch (error) {
    console.error('Error:', error);
    await api.editMessage('Error: ' + error.message, chill.messageID);
  }
};

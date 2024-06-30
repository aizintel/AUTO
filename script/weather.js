const axios = require('axios');

module.exports.config = {
  name: "weather",
  version: "1.0",
  hasPermision: 0,
  credits: "Hassan",//convert by chill
  description: "Get weather information for a city",
  usePrefix: false,
  usages: "weather <city_name>",
  cooldown: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  const startsWithTrigger = (str, trigger) => str.slice(0, trigger.length) === trigger;

  if (!startsWithTrigger(event.body, "weather")) return;

  const args = event.body.split(/\s+/);
  args.shift();

  const { threadID, messageID } = event;
  const cityName = args.join(' ');

  if (!cityName) {
    api.sendMessage("Please provide a city name.", threadID, messageID);
    return;
  }

  const url = `https://nodejs-2-jrqi.onrender.com/weather?city=${encodeURIComponent(cityName)}`;

  api.sendMessage("Fetching weather information, please wait...", threadID, async () => {
    try {
      const response = await axios.get(url);

      if (response.data) {
        const weatherData = response.data;
        const city = weatherData.name;
        const country = weatherData.sys.country;
        const temperature = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;

        const messageBody =
          `🌆 **City:** ${city}, ${country}\n` +
          `🌡️ **Temperature:** ${temperature}°C\n` +
          `☁️ **Weather:** ${weatherDescription}\n` +
          `💧 **Humidity:** ${humidity}%\n` +
          `🌬️ **Wind Speed:** ${windSpeed} m/s`;

        api.sendMessage(messageBody, threadID, messageID);
      } else {
        api.sendMessage('Sorry, no weather information was found for the specified city.', threadID, messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('Sorry, there was an error fetching weather information.', threadID, messageID);
    }
  });
};

module.exports.run = async function ({ api, event }) {};

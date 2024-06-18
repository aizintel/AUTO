const axios = require('axios');

module.exports.config = {
  name: "research",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  credits: "August Quinn",
  description: "Search for research articles on Arxiv.",
  commandCategory: "Information Retrieval",
  usage: ["research [query]"],
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(' ');

  if (!query) {
    api.sendMessage('Please provide a search query for Arxiv.', threadID, messageID);
    return;
  }

  try {
    const response = await axios.get(`https://gpt4withcustommodel.onrender.com/arxiv?query=${encodeURIComponent(query)}`);
    const data = response.data;

    if (!data.title) {
      api.sendMessage('No research articles found on Arxiv for the given query.', threadID, messageID);
      return;
    }

    const { title, authors, published, summary } = data;

    const responseMessage = `📚 Arxiv Research Article\n\n📝 Title: ${title}\n\n👥 Authors: ${authors.join(', ')}\n\n🗓️ Published Date: ${published}\n\n📖 Summary: ${summary}`;

    api.sendMessage(responseMessage, threadID, messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while fetching Arxiv data.', threadID, messageID);
  }
};

const axios = require('axios');
module.exports.config = {
  name: "recipe",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Get a random recipe.",
  usage: "recipe",
  credits: "Developer",
  cooldown: 0
};
module.exports.run = async ({
  api,
  event
}) => {
  const {
    threadID,
    messageID
  } = event;
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    const recipe = response.data.meals[0];
    const {
      strMeal: title,
      strCategory: category,
      strArea: area,
      strInstructions: instructions,
      strMealThumb: thumbnail,
      strYoutube: youtubeLink
    } = recipe;
    const recipeMessage = `
        Title: ${title}
        Category: ${category}
        Area: ${area}
        Instructions: ${instructions}
        ${youtubeLink ? "YouTube Link: " + youtubeLink : ""}
        `;
    api.sendMessage(recipeMessage, threadID, messageID);
  } catch (error) {
    api.sendMessage("Sorry, I couldn't fetch a recipe at the moment. Please try again later.", threadID);
  }
};

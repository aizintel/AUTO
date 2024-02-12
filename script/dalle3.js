const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "dalle3",
    aliases: ["dalle3"],
    version: "1.0",
    credits: "JARiF",
    cooldown: 15,
    role: 0,
    description: "Generate images by Dalle3",
    hasPrefix: false,
};

module.exports.run = async function ({ api, message, args }) {
    try {
        const p = args.join(" ");

        const w = await message.reply("Please wait...");

        // const cookieString = await fs.readFile('dallekey.json', 'utf-8');
        // const cookie = JSON.parse(cookieString);

        const data2 = {
            prompt: p,
            cookie: "1N6XdZoEjrs9bNG3W07jM2krHSUQ0vYNaIAvNGbFVnz7xSZZSDfDUTqYW3g7IEKvGoxieQVFUmX8xBnN5O10gBbCENlfZiY5GPbPlyAwaPUM7lRzYXm3sFtxoQjyZEVcBCwgT-pLt9L8_hVtK2L_CQzjIdgfLIPKhWZymDiBa356Y31UQ_0A1wXZTpVXrN2tMct54TIh3q6Lvf-Y8ucNDI6M3NVjK46oOOi4bZEX43sI"
        };

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post('https://project-dallee3.onrender.com/dalle', data2, config);

        if (response.status === 200) {
            const imageUrls = response.data.image_urls.filter(url => !url.endsWith('.svg'));
            const imgData = [];

            for (let i = 0; i < imageUrls.length; i++) {
                const imgResponse = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
                const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
                await fs.outputFile(imgPath, imgResponse.data);
                imgData.push(fs.createReadStream(imgPath));
            }

            await api.unsendMessage(w.messageID);

            await message.reply({
                body: `✅ | Generated`,
                attachment: imgData
            });
        } else {
            throw new Error("Non-200 status code received");
        }
    } catch (error) {
        return message.reply("Redirect failed! Most probably bad prompt.");
    }
};

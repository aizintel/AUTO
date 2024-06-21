let path = __dirname + "/cache/spotify.mp3";
const axios = require("axios");
const fs = require("fs");

module.exports.config = {
		name: "spotify",
		version: "1.0.2",
		role: 0,
		credits: "joshua deku",
		description: "Play and Download music from Spotify",
		hasPrefix: false,
		cooldown: 5,
		aliases: ["spotify"]
};

module.exports.run = async function ({ api, event, args }) {
		try {
				const { spotify, spotifydl } = require("betabotz-tools");
				let q = args.join(" ");
				if (!q) return api.sendMessage("[ ❗ ] - Missing title of the song", event.threadID, event.messageID);

				api.sendMessage("[ 🔍 ] Searching for “" + q + "” ...", event.threadID, async (err, info) => {
						try {
								const r = await axios.get("https://lyrist.vercel.app/api/" + q);
								const { lyrics, title } = r.data;
								const results = await spotify(encodeURI(q));

								let url = results.result.data[0].url;

								const result1 = await spotifydl(url);

								const dl = (
										await axios.get(result1.result, { responseType: "arraybuffer" })
								).data;
								fs.writeFileSync(path, Buffer.from(dl, "utf-8"));
								api.sendMessage(
										{
												body:
														"·•———[ SPOTIFY DL ]———•·\n\n" + "Title: " + title + "\nLyrics:\n\n" +
														lyrics +
														"\n\nYou can download this audio by clicking this link or paste it to your browser: " +
														result1.result,
												attachment: fs.createReadStream(path),
										},
										event.threadID,
										(err, info) => {
												fs.unlinkSync(path);
										}
								);
						} catch (error) {
								console.error(error);
								api.sendMessage("An error occurred while processing your request.", event.threadID);
						}
				});
		} catch (s) {
				api.sendMessage(s.message, event.threadID);
		}
};

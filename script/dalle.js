const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FACSBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACGr/CZI3/EJfUATeABTqPf1acSB+8vmkQDmT8UMsGvLdK+Zp+LcJSBDzZ9jmhussW5yrEM9BbvzE93krl3xRelOZ8akSR9DflM8Tfno4I0N/jlFseNu6/FMJrxHPe6Yqiw+Ri23HlnyQkONrGTDVx5yGO1zbH1VowxpHaGpM9P98Fw90m3Fn79x8PPxuVLkYccq08kmKLRZZhUka1uUqkFdzUNbdvXbEqHePV6fROZzVVZ4PSBZmQQBc3xBIepUuPqSaUR7Umi0uBSg7/D87MVjBQ9cGRYGQKi/+B+Fol30EDm2XXoY1CsUAqXD+4UI/TFkgxingEPpqA+LXUPp8Jg6uqHD198tkYVS0R88ZBNODUX4qH7x/QE/Bun9RjESRgoGMB7Y0zfB4tDURD2hXW+b9BitUrlu06WyBeoPTle0f5Kxh6Cp6SYWummB82dHsYzh3tzTBA+wvAv+DDeyUv5gA3zFBlFsAFe3ZebPKgopOLOTcvd7fyJrNNt7OKQGsiNWPj7FGdM8XYrxz3xyHl9AtlFQ0c6KnPe/GvQXMpFr09YIcRV0Zc5PuQEMmwrQJ0bLv9GOLSyKAvk7O2POOw0RVKFKkI/KzUbMtv3/AfDSsfMVu6fMC/Mh4jDk4oVCXdfqVwOFDsdMmE07Qfjna8ApsVdnjpmAsLFk1knLuPNRk+Fy2glDmQNhs99+PpNbCEiDmGZzIceO/l+C6PO5EYMlTkxTcN6As5xFm9pZW9OVKr0KEJwrTBnV+3qXGVBh/pqv5an0Hqt6VFN+7PFDj81gn5ueqbIfBCHcNyXtDiFbwR4ZAbGhNj8JmtjblZQmbb56TTwt/Bk69LAeEZu8Lv2y8Assm2ng1jx8exIWSLQ1BppR4/sgwlxOSkjZZ2rIIuJpTBaZ4yp+n7RupjjEDfFiUjg0jqanlNhIu621MIvzf4mIKo4PQ3Ca0KarnpknsRdI97fcLL2f+mAG1quUf4kkiRslgLVQZkWZWzCVEiAyobfbHkhxvNdKt9tzkPLtbGFGbfdPRGYdjEFE5kpsjXXzNSqqG93GhZwFX6PvPHXqogkdymyQ0yrV3dGS8C8dKtBpYAVIGyco6a/r8BRfP2KjAl3ARhIHjviIHa6gx5ldPvMso35NTI/V7U6xwVuA2BcVttcIEPTbiKP7Wl4lfNiANDTgeHB3boXI2moMFHRxU/mIG+HS4sMSYdVM4DQ5Igj8YQ8KnW8D5ceeciiXOTWB7gbASToQTEA7DVCi1zXs+hedZb7cUgDBB05LMV1UE5j2Vf3T2H6EbDitjlhfqVSEkNBBZK1EI3VrYHc7E8fyWKIMbjBzqcXC7PH3RLf1z3NIDPulDm6KMbJ2IplDi59ocODxDhyadAMaHXfvSmGH2GIeFi6GYAgTnCPbo/jv/c1d7rCO6gtH3meGX2I2hWdqILOqvmY0f6Q92Vgcql7mWXDAappIKbfGtV5Ay+87B9ydB7/4Ta6E3UTEUABs2tkjhx088LHZ/zXuzV5QzTDx7";
const _U = "1MBj2g3P1QxOWMjpdQdDkXVQAj512VfPb--wvpwcUrWPxTvNE4XDzTkwncFg_RCz_jidqLFhFaB750ZucXxRNIWx3rfIOYnLnxqgQEV6ec899MmeQnFtpGFmbhLDyLm3hw0bg_rkwHXTzDAQhmPy_Yvn_laB0vDCF7juex6l10yHB1cYUcOWLkXQ9p7p8w11_mVdpBdKMAzHNHxxUBmtsGg0YTpBdzgoSDGZVWACF_Z8";

module.exports.config = {
  name: "dalle",
  version: "1.0",
  role: 0,
  credits: "cliff",//api by Samir
  hasPrefix: false,
  description: "dalle",
  usages: "{prefix}dalle <search query> -<number of images>",
  cooldown: 0,
  aliases: ["dalle"],
};

module. exports. run = async function ({ api, event, args }) {
  const keySearch = args.join(" ");
  const indexOfHyphen = keySearch.indexOf('-');
  const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
  const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;

  try {
    const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
    const data = res.data.results.images;

    if (!data || data.length === 0) {
      api.sendMessage("No images found for the provided query.", event.threadID, event.messageID);
      return;
    }

    const imgData = [];
    for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
      const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
      const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
      await fs.outputFile(imgPath, imgResponse.data);
      imgData.push(fs.createReadStream(imgPath));
    }

    await api.sendMessage({
      attachment: imgData,
      body: `Here's your generated image`
    }, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
  } finally {
    await fs.remove(path.join(__dirname, 'cache'));
  }
};

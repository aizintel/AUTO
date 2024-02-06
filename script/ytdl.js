const axios = require('axios');
const fs = require('fs');
const path = require("path");
module.exports.config = {
  'name': 'ytdl',
  'version': "1.0.0",
};
const downloadVideo = async (_0x698199, _0x7196b2) => {
  try {
    const _0x196bea = await axios.get(_0x698199, {
      'responseType': "stream"
    });
    const _0x3920b9 = _0x196bea.data;
    const _0x2fddfa = fs.createWriteStream(_0x7196b2);
    return new Promise((_0x3508a9, _0x1c2a25) => {
      _0x3920b9.pipe(_0x2fddfa);
      _0x2fddfa.on("finish", () => _0x3508a9(_0x7196b2));
      _0x2fddfa.on("error", _0x470147 => _0x1c2a25(_0x470147));
    });
  } catch (_0x2cd204) {
    console.error(_0x2cd204);
    return null;
  }
};
module.exports.run = async function ({
  api: _0xd74edb,
  event: _0xd4bf03,
  args: _0x25c5da
}) {
  if (_0x25c5da.length === 0x0) {
    _0xd74edb.sendMessage("Please provide a YouTube video link.", _0xd4bf03.threadID);
    return;
  }
  const _0x4818a2 = _0x25c5da[0x0];
  const _0x68df57 = path.join(__dirname, "temp");
  if (!fs.existsSync(_0x68df57)) {
    fs.mkdirSync(_0x68df57);
  }
  try {
    const _0x40e3d0 = 'video_' + Date.now() + ".mp4";
    const _0x20a046 = path.join(_0x68df57, _0x40e3d0);
    const _0xfa35be = "https://scp-09.onrender.com/api/ytdl?url=" + encodeURIComponent(_0x4818a2);
    const _0x294f46 = await downloadVideo(_0xfa35be, _0x20a046);
    if (_0x294f46) {
      _0xd74edb.sendMessage({
        'attachment': fs.createReadStream(_0x294f46)
      }, _0xd4bf03.threadID, () => {
        fs.unlinkSync(_0x294f46);
      });
    } else {
      _0xd74edb.sendMessage("Failed to download the video.", _0xd4bf03.threadID);
    }
  } catch (_0xbd2658) {
    console.error(_0xbd2658);
    _0xd74edb.sendMessage("An error occurred while downloading the video.", _0xd4bf03.threadID);
  }
};

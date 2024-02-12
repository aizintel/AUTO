const cron = require('node-cron');
const fs = require('fs');
const axios = require('axios');
const request = require('request');

const activeThreads = {};

const videoUrls = [
    "https://drive.google.com/uc?export=download&id=176Eu9z7M04GiVNc35ekaiTB0p9iafhMu",
       "https://drive.google.com/uc?export=download&id=17I2BbXaO_PKgwaBRNCWPt_dzlI3r96Rl",
       "https://drive.google.com/uc?export=download&id=179jQotlqiNnmiN-tbDoVBuBXaf8Q8Seq",

    "https://drive.google.com/uc?export=download&id=17Ni9k27ntHZsymBju7pvUkr0M3CoUBQt",
       "https://drive.google.com/uc?export=download&id=17LIPENw0vdC3yKYQQcA-gKC0A1VNLir4",
       "https://drive.google.com/uc?export=download&id=17KfQazN6OvCOFHrFlKLoyZmIXCF2xI7x",

    "https://drive.google.com/uc?export=download&id=1bDLI6AnlY1VjYkWyPgRDe8j-7d8XCHiE",
       "https://drive.google.com/uc?export=download&id=1bU4ztKp-Kp0CqQNEBQr8rYINQAi3fL9T",
       "https://drive.google.com/uc?export=download&id=1bBk094aEZCUW3YLZXL04MZZSF06WKd1-",

    "https://drive.google.com/uc?export=download&id=1bDgxYWkRZeKmYWisJ__cq9f8zKj-WMnR",
       "https://drive.google.com/uc?export=download&id=1bTKx-I1SIUbNdKgXqQq4DPbZMYhOOOwo",
       "https://drive.google.com/uc?export=download&id=1brtWHiR0lvL5w0SOTYYjUuNpUl60RBeb",

    "https://drive.google.com/uc?export=download&id=1g7h2bE41_z3qcl2hr2BRRAySgfZmO3Zs",
       "https://drive.google.com/uc?export=download&id=1gBgNv96qi_MSZs-g84hFMPL6gmGi7YgQ",
       "https://drive.google.com/uc?export=download&id=1g-uc-gTklXX-qxkxmZas4SFGUgbNc3Eo",

    "https://drive.google.com/uc?export=download&id=1g2omxwP3C4KjHX6Qd41awQiw_MsGty6y",
       "https://drive.google.com/uc?export=download&id=1gDA6Ggt701QZx2HXLqaDLlAM4jrNW5GW",
       "https://drive.google.com/uc?export=download&id=1fzz61nQzn2F9noo9AsidfHlVO-8o0Uc5",

    "https://drive.google.com/uc?export=download&id=1gManM5_7q4-HBFgE3eFTsFbgxLMQ9gNA",
       "https://drive.google.com/uc?export=download&id=1ftqtNPSa9pq7dAORdFOARFYRIkbEH622",
       "https://drive.google.com/uc?export=download&id=1gPOOwsySwez284oW9k6PRYSUM1WeGfWw",

    "https://drive.google.com/uc?export=download&id=1fcd5Zo7ScVkLz7aHrWnhjBhJEgqM9qcF",
    "https://drive.google.com/uc?export=download&id=1skYxsVuJRzLd_cRuEnJOHEbTHdzU3RfM",
    "https://drive.google.com/uc?export=download&id=1sk5gR5vjQBerAnecows1mCTUZ6tNiaCM",
    "https://drive.google.com/uc?export=download&id=1srRP51OByUmax2CMnB56Cj7qwUUKoKa2",
    "https://drive.google.com/uc?export=download&id=1suudCwfYYnmtqyBLAzFcXTgH0iPIVmMC",
    "https://drive.google.com/uc?export=download&id=1swbIV9nQEoOYfISvITcMWVnI2o2o_Khx",
    "https://drive.google.com/uc?export=download&id=1l1atHUuFbHlpxiq509WDEB-o_lxJ7nCh",
    "https://drive.google.com/uc?export=download&id=1l7loc-V7NkbCDcXKHH_x7X_X5nwmN6Ek",
    "https://drive.google.com/uc?export=download&id=1lAaP27aSPL1mEyX_Tz19YcyadTs-xlTp",

    "https://drive.google.com/uc?export=download&id=1lBX2Ic8W_1vpK9STZPxSs3qnA8H1Sn1V",
    "https://drive.google.com/uc?export=download&id=1lG5bFLemHBmS48hsYxJ7V14owpK9Rjpa",
    "https://drive.google.com/uc?export=download&id=1lL1iMG0Dff1MMFf61yvHUNKy4dCWueJG",

    "https://drive.google.com/uc?export=download&id=1lXyq__dijoWqMR9-jQLuq_gNA_zowPYK",
    "https://drive.google.com/uc?export=download&id=1lcZLJeB5k2VJJSbB1gOTGASXC7HR83dG",
    "https://drive.google.com/uc?export=download&id=1lglaw5pmVrITNWJcZPE4hKGsJKZqxikf",

    "https://drive.google.com/uc?export=download&id=1lhPy2PHfoW6c5Vya4dNHqmMhgPA-rUkI",
    "https://drive.google.com/uc?export=download&id=1ljpgxDga7E7Z-szZGLgjzXG6m6yTTYUu",
    "https://drive.google.com/uc?export=download&id=1lniCIs9cWt3wfU2Bnwd7aU0n6NpIQNa6",

    "https://drive.google.com/uc?export=download&id=1m-dj7LPcRxaTgqnDrEp5mRkjvWl8xutN",
    "https://drive.google.com/uc?export=download&id=1m1ptgy1aMqRzapSTRf5BDLoTdM-9BXYa",
    "https://drive.google.com/uc?export=download&id=1m3ciYuIVHBDSXIHM-Pqfrd354GBAnndM",

    "https://drive.google.com/uc?export=download&id=1m66rc-Swq7jMq0VKaZCEGzk70NmQsr33",
    "https://drive.google.com/uc?export=download&id=1mAH1VDqTTfb1JUFxoivaBxLr0anpVgR1",
    "https://drive.google.com/uc?export=download&id=1mKxbJFBZu1gg3KKL2YYoqryxi09K6G34",

    "https://drive.google.com/uc?export=download&id=1mMv5GEO0w6K2CuBtMjQB5CKv2zyQarb_",
    "https://drive.google.com/uc?export=download&id=1mPxX9feu7vY08Yq3s2UBBcKNPGX_lIIx",
    "https://drive.google.com/uc?export=download&id=1mRRTOcnShsOR10YvcwcyhF5UrHd6iB-4",

    "https://drive.google.com/uc?export=download&id=1ma8JJYntcciEzTi0WO-V7aDKf301pgZ1",
    "https://drive.google.com/uc?export=download&id=1mbT9MlmDVnPg1_hBShs-TZdy4oMcen6b",
    "https://drive.google.com/uc?export=download&id=1mhCMrrXQ8Ket8JjRpyqkdnvD5WD8icCm",

    "https://drive.google.com/uc?export=download&id=1mk312g8O3ZnhQnCtMvQWSSQl1CFY-yqM",
    "https://drive.google.com/uc?export=download&id=1mnQpkIvOPRBnns0xF4c7mP80Laz9nvH3",
    "https://drive.google.com/uc?export=download&id=1msWffBh2N_gVG5GSocvk6wVeMzmnapCP",

    "https://drive.google.com/uc?export=download&id=1muAjmXHEuTZoezO01whXM7ATEcxPGL8t",

    "https://drive.google.com/uc?export=download&id=1umV1Oj__0w0V7Ro0zb97sx5pSBtPfxuN",
       "https://drive.google.com/uc?export=download&id=1n2oad_dyVukQY7yuqEUe7tsA3_u4g_ZU",

    "https://drive.google.com/uc?export=download&id=1nFwlS-FLSG8Bwd1G7YWVYHoYVs_hwZTr",
       "https://drive.google.com/uc?export=download&id=1nIYAoKY2F3XftNkJbpc21MhhS2_naZlH",
       "https://drive.google.com/uc?export=download&id=1nJkeXFodWtjHLZv0x50TDyjjbSswis_H",

    "https://drive.google.com/uc?export=download&id=1nN8NAQz6BR2It08voEJOZ4AntlHbk206",
       "https://drive.google.com/uc?export=download&id=1nQlUGwi85rOSORQpOhB8_KEIjyP0uHrQ",
       "https://drive.google.com/uc?export=download&id=1nStzVUIuN9Y47ZWIMul7N0nlJwPjFNnr",

    "https://drive.google.com/uc?export=download&id=1nV3uSFvhy2gzdVQaC-b6k59BCLm64olU",
       "https://drive.google.com/uc?export=download&id=1o-J2hB95D7vm7n4u_Z0LOi0_EHzLsqDI",
       "https://drive.google.com/uc?export=download&id=1o37Ip2Ahx937lznsoYGR013ogGHq_3bi",

    "https://drive.google.com/uc?export=download&id=1o3zXUGvxBp29TtU7oWLm-QZ3WmWY7Ae4",
       "https://drive.google.com/uc?export=download&id=1o5KJG7rK0Hn5X_WOQHbPAPOTFCzzU609",

    "https://drive.google.com/uc?export=download&id=1i7F_H1RJrHOfVcyyOMM1XmdufQNfnONB",
    "https://drive.google.com/uc?export=download&id=1iFlutSIwhzitC3o-du3O5H7piKDeKa2C",

    "https://drive.google.com/uc?export=download&id=106X_sH7lS34p7H5OK8HVTxGTTPHpIB5s",

    "https://drive.google.com/uc?export=download&id=1-vuDOkIhFEzWhF2AixHVaQMtvCsPapqp"
];

module.exports.config = {
    name: 'musicron',
    version: '2.0.0',
    role: 0,
    credits: 'Cliff_shipazu',
    hasPrefix: false,
    description: 'Automatically send videos on and off',
    usages: '[on/off]',
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, input }) {
    const args = event.body.split(' ');
    const threadID = event.threadID;

    if (args[1] === 'on') {
        if (!activeThreads[threadID]) {
            activeThreads[threadID] = true;
            api.sendMessage(`Automatic sending of videos is now enabled.`, event.threadID, (err, info) =>
                setTimeout(() => {
                    api.unsendMessage(info.messageID);
                }, 20000),
                event.messageID
            );

            cron.schedule('*/30 * * * *', async () => {
                try {
                    if (activeThreads[threadID]) {
                        const chosenVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
                        const file = fs.createWriteStream(__dirname + '/cache/shoti.mp4');
                        const rqs = request(encodeURI(chosenVideoUrl));
                        rqs.pipe(file);
                        file.on('finish', () => {
                            api.sendMessage(
                                {
                                    body: `𝗔𝗨𝗧𝗢𝗦𝗘𝗡𝗗 𝗩𝗜𝗗𝗘𝗢 𝗙𝗥𝗢𝗠 𝗗𝗥𝗜𝗩𝗘 𝗘𝗩𝗘𝗥𝗬 30 𝗠𝗜𝗡𝗨𝗧𝗘𝗦\n\nDRIVE-𝗜𝗗: ${chosenVideoUrl}`,
                                    attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4'),
                                },
                                threadID,
                                (error, info) => {
                                    if (!error) {
                                        fs.unlinkSync(__dirname + '/cache/shoti.mp4');
                                    }
                                }
                            );
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        } else {
            api.sendMessage('Automatic sending of videos is already ON in this thread.', threadID);
        }
    } else if (args[1] === 'off') {
        if (activeThreads[threadID]) {
            activeThreads[threadID] = false;
            api.sendMessage(`Automatic sending of videos is now disabled.`, threadID);
        } else {
            api.sendMessage('Automatic sending of videos is already OFF in this thread.', threadID);
        }
    }
};

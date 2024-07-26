const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
	name: "war",
	version: "1.0.0",
	role: 0,
	credits: "cliff",
	description: "War in the chat box",
	hasPrefix: false,
	usages: "war start",
	cooldown: 10,
};

let isWarModeActive = false;
let messageTimeouts = [];
let autoDeactivateTimeout;

function clearMessageTimeouts() {
	messageTimeouts.forEach(timeout => clearTimeout(timeout));
	messageTimeouts = [];
}

function startWar(api, event) {
	const messages = [
		"ginalit moko putanginamo ka walang iyakan ah bwakananginaka eh",
		"gumagamit ka nalang bot ingay mo pa tanginaka ket nga siguro reboot ng cp mo di mo alam dami mong satsat ampota",
		"paduduguin ko ulo mo ewan kona lang kung dika mag panic",
		"gago ampota palamunin",
		"pabigat sa pamilya tanginaka lagay mo na cp mo paluin ka mamaya di kapa nag hugas plato HAHAHAHA tanga ampota",
		"asa sa magulang feeling coolkid ang cool mo naman tanginamo pwede kana mamatay",
		"syempre mag rereply ka dito tanga ka eh alam mong bot kakausapin mo ulol kanaba?",
		"jejemon am.puta liit tite",
		"kaya pa ? baka mapahiya ka sa gc nyo leave kana block mo bot HAHAHAHAHA luha mo boi punasan mo na",
		"pumapatol sa bot am.puta baka ikaw yung tigang na lalaki na nag papasend ng nudes",
		"feeling coolkid amputa babatukan lang kita e",
		"kaya paba? pag naluluha kana stop na ah leave na awa ako sayo eh bata",
		"baka ikaw yung 16 years old na nag cocomment sabi ng minor ah ulol HAHAHAHAHA",
		"Walis kana ng bahay nyo tamo lilipad tsinelas sa mukha mo mamaya",
		"tanginaka ginigigil mo bot ko sarap mong i sidekick with recall putanginaka",
		"gulat ka no ? HAHAHAHA tanga ka kase d moto alam",
		"nagrereply ka palang minumura na kita tanginamo",
		"shempre rereply ka ule dito yakk ilalabas mo pagiging coolkid mo frfr istg",
		"baka pag in-english kita pati nanay mo mahimatay",
		"feeling famous nagmamakaawa i heart profile agoiiii HAHAHAHAHAA LT si tanga",
		"lakas maka myday pangit naman tuwang tuwa pa pag may nag heart napindot lng naman yak",
		"face reveal nga baka puro sipon at luha kna ah HAAHHAHAHA iyakin ka eh",
		"stop naba ako ? baka hiyang hiya kana sa sarili mo leave kana wala kang ambag sa gc nato",
		"wala kang masabi? malamang tanga ka gago ka putangina kang nigga ka HAHAHAHAHA",
		"feeling gwapo/maganda pag hinubad facemask mukhang tilapiang nakawala sa tubig ampota",
		"till next time gago bye na pasok kana sa aquarium mo bawal ka sa lupa mukha kang wtf",
		"tangina mo mamatay kana pabigat ka lang sa pamilya mo e",
		"di kapa minumura umiiyak kana",
		"inutusan ako na dapat nakakadepressed at nakakatraumatize daw",
		"kokotong kotongan lang kita rito e",
		"bye kinginamo pangit"
	];
	
	messages.forEach((msg, index) => {
		const timeout = setTimeout(() => {
			if (isWarModeActive) {
				api.sendMessage(msg, event.threadID);
			}
		}, index * 5000);
		messageTimeouts.push(timeout);
	});

	// Automatically deactivate war mode after 5 minutes (300000 milliseconds)
	autoDeactivateTimeout = setTimeout(() => {
		if (isWarModeActive) {
			isWarModeActive = false;
			clearMessageTimeouts();
			api.sendMessage("War mode automatically deactivated after 5 minutes.", event.threadID);
		}
	}, 300000);
}

module.exports.run = async function({ api, args, event, admin }) {
	if (args.length === 0) {
		api.sendMessage("Type 'war on' to activate war mode or 'war off' to deactivate war mode.", event.threadID);
		return;
	}
	
	const command = args[0].toLowerCase();
	
	if (command === "on") {
		if (isWarModeActive) {
			api.sendMessage("War is already active!", event.threadID);
		} else {
			isWarModeActive = true;
			api.sendMessage("War mode activated!", event.threadID);
			startWar(api, event);
		}
	} else if (command === "off") {
		if (isWarModeActive) {
			isWarModeActive = false;
			clearTimeout(autoDeactivateTimeout);
			clearMessageTimeouts();
			api.sendMessage("War mode deactivated!", event.threadID);
		} else {
			api.sendMessage("War mode is not active!", event.threadID);
		}
	} else {
		api.sendMessage("Invalid command! Use 'war on' to start and 'war off' to stop.", event.threadID);
	}
};

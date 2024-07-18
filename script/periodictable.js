const periodicTable = require('periodic-table');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: "periodictable",
	role: 0,
	credits: "Jonell Magallanes",
	description: "search periodical table",
	usage: "[element]",
	cooldown: 5,
	hasPrefix: false,
};

module.exports.run = async function({ api, event, args }) {
		if (!args[0]) return api.sendMessage("Please provide an element symbol, name, or atomic number.", event.threadID);

		let elementQuery = args.join(" ");
		let element;

		if (!isNaN(elementQuery)) {
			element = periodicTable.elements[parseInt(elementQuery) - 1];
		} else {
			element = periodicTable.symbols[elementQuery] || periodicTable.names[elementQuery];
		}

		if (!element) return api.sendMessage("Element not found.", event.threadID);

		let message = `Element Information:\n- Name: ${element.name}\n- Symbol: ${element.symbol}\n- Atomic Number: ${element.atomicNumber}\n- Atomic Mass: ${element.atomicMass}\n- Electronic Configuration: ${element.electronicConfiguration}\n- Oxidation States: ${element.oxidationStates}\n- Standard State: ${element.standardState}\n- Bonding Type: ${element.bondingType}\n- Melting Point: ${element.meltingPoint} K\n- Boiling Point: ${element.boilingPoint} K\n- Density: ${element.density} g/cm3\n- Year Discovered: ${element.yearDiscovered}`;

		api.sendMessage(message, event.threadID);
};

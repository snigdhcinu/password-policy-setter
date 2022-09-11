const main  = require ('./src/password-policy-setter');
const log   = require ('./utils/log');
const store = require ('./utils/store');

let config    = {};
let root      = {};
let errState  = false;
let debugMode = false;
let password;

root.init = (argv) => {
	if (paramsMissing (argv)) {
		errState = true;
		return;
	}

	debugMode = argv.debug || false;
	//store.set ('debugMode', debugMode);

	let size    = (typeof argv.size === 'number') ? (argv.size <= 0 ? 0 : (argv.size <= 1000 ? argv.size : 1000)) : (argv.size ? 1 : 0);
	let lower   = (typeof argv.lower === 'number') ? (argv.lower <= 0 ? 0 : (argv.lower <= size ? argv.lower : size)) : (argv.lower ? 1 : 0);
	let upper   = (typeof argv.upper === 'number') ? (argv.upper <= 0 ? 0 : (argv.upper <= size ? argv.upper : size)) : (argv.upper ? 1 : 0);
	let numbers = (typeof argv.numbers === 'number') ? (argv.numbers <= 0 ? 0 : (argv.numbers <= size ? argv.numbers : size)) : (argv.numbers ? 1 : 0);
	let splChar = (typeof argv.splChar === 'number') ? (argv.splChar <= 0 ? 0 : (argv.splChar <= size ? argv.splChar : size)) : (argv.splChar ? 1 : 0);

	config = {
		size,
		lower,
		upper,
		numbers,
		splChar,
	};

	main.init (config);
};

root.satisfied = (pwd) => {
	if (errState)
		return;

	let result = main.satisfied (pwd);
	return result;
};

root.findAnomaly = (pwd) => {
	if (errState)
		return;

	let result = main.findAnomaly (pwd);
	return result;
};

const paramsMissing = (argv) => {
	try {
		if (!argv.size)
			return true;
	}
	catch (e) {
		//log.error ('Error : ' + e);
	}
};

module.exports = root;

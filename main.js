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

	config = {
		size    : argv.size,
		lower   : argv.lower || false,
		upper   : argv.upper || false,
		numbers : argv.numbers || false,
		splChar : argv.splChar || false,
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

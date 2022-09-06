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
		lower   : argv.lower,
		upper   : argv.upper,
		numbers : argv.numbers,
		splChar : argv.splChar,
	};

	main.init (config);
};

root.satisfied = (pwd) => {
	if (errState)
		return;

	main.satisfied (pwd);
};

root.findAnamoly = (pwd) => {
	if (errState)
		return;

	main.findAnamoly (pwd);
};

const paramsMissing = (argv) => {
	try {
		if (!argv.size)
			return true;

		if (!argv.lower)
			return true;

		if (!argv.upper)
			return true;

		if (!argv.numbers)
			return true;
	}
	catch (e) {
		//log.error ('Error : ' + e);
	}
};

module.exports = root;

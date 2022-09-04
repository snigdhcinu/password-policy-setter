const main  = require ('./src/make-db-backup');
const log   = require ('./utils/log');
const store = require ('./utils/store');

let config    = {};
let module    = {};
let errState  = false;
let debugMode = false;

module.init = (argv) => {
	if (paramsMissing (argv)) {
		errState = true;
		return;
	}

	debugMode = argv.debug || false;
	store.set ('debugMode', debugMode);

	config = {
		mongodbUri       : argv.mongodbUri,
		backupDir        : argv.backupDir,
		zipPath          : argv.zipPath,
		keepLocalBackups : argv.keepLocalBackups || false,
		noOfTotalBackups : argv.noOfTotalBackups || 7,

		s3         : {
			key     : argv.key,
			secret  : argv.secret,
			region  : argv.region,
			bucket  : argv.bucket,
			name    : argv.name || 'backup',
			dir     : argv.dir,
		},
	};
};

module.start = async () => {
	if (errState)
		return;

	try {
		await main.makeDbBackup (config);
	}
	catch (err) {
		log.error ({err});
		throw ({err});
	}
};

const paramsMissing = (argv) => {
	try {
		if (!argv.mongodbUri)
			return true;

		if (!argv.backupDir)
			return true;

		if (!argv.zipPath)
			return true;

		if (!argv.key)
			return true;
		
		if (!argv.secret)
			return true;

		if (!argv.bucket)
			return true;

		if (!argv.region)
			return true;

		if (!argv.dir)
			return true;
	}
	catch (e) {
		log.error ('Error : ' + e);
	}
};

module.exports = module;

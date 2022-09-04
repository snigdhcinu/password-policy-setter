const store = require ('./store');
const log   = {};

log.info = (obj, str) => {
	if (store.get ('debugMode'))
		console.log (obj, str);
};

log.debug = (obj, str) => {
	if (store.get ('debugMode'))
		console.debug (obj, str);
};

log.warn = (obj, str) => {
	if (store.get ('debugMode'))
		console.warn (obj, str);
};

log.error = (obj, str) => {
	if (store.get ('debugMode'))
		console.error (obj, str);
};

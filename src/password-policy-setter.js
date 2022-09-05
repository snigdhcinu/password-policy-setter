/*TODO: Future improvements / updates.
	0. make error object, an actual error object.
	1. add custom regex.
	2. provide a medium to specify min. upper/lower/numeric characters, other than default 1.
	3. restructure the parameters.
	4. Improve maturity of code, use more precise methods, refactor the prepend and append process.
*/
//const pattern = /^.*(?=\w{8,})(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*\d.*).*$/gm; 
let pattern  = '';
let errState = false;
let errObj   = {};

const policy = {};
let map = {
	size    : '\\w\\W{8,}', // gets overwritten later, just another way to write the same expression that replaces it.
	lower   : '.*[a-z].*',
	upper   : '.*[A-Z].*',
	numbers : '.*\\d.*',
	splChar : '.*[^a-zA-Z0-9].*' // not using \W coz, '_' included in \w.
}

policy.get = function () {
	if (errState)
		return errObj;

	return pattern;
};

policy.init = function (conditions) {
	pattern = `^.*`;

	Object.keys(conditions).forEach((key) => {
		if (!map[key]) {
			let msg = "Unknown or Unidentified condition passed, exiting";
			console.log(msg, key);
			errState = true;
			errObj   = {
				message : msg,
				key,
			};

			return;
		}

		if (key && conditions[key]) {
			let unit;

			if (key === "size") {
				unit = `(?=.{${conditions[key]},})`
				map['size'] = unit;
			} else {
				unit = `(?=${map[key]})`;
			}

			pattern += unit;
		}
	});

	pattern += `.*$`;

	pattern = new RegExp(pattern, "gm");
};

policy.satisfied = function (password) { 

	if (errState)
		return errObj;

	if (!password) 
		return false; 

	const input = password.trim (); 

	if (!input.match (pattern)) 
		return false; 

	return true; 
};

policy.findAnomaly = function (password) {

	if (errState)
		return errObj;

	let result = {};
	Object.keys(map).forEach((item) => {
		result[item] = false;
	});

	if (!password) return result;

	let input = password.trim();

	Object.keys(map).forEach((item) => {
		if (input.match(map[item])) result[item] = true;
	});

	return result;
};

module.exports = policy;

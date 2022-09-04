/*TODO: Future improvements / updates.
	1. add regexp for spl. characters.
	2. provide a medium to specify min. upper/lower/numeric characters, other than default 1.
	3. restructure the parameters.
	4. Improve maturity of code, use more precise methods, refactor the prepend and append process.
*/
//const pattern = /^.*(?=\w{8,})(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*\d.*).*$/gm; 
let pattern  = '';
const policy = {};

const map = {
	size    : '\\w{8,}',
	lower   : '.*[a-z].*',
	upper   : '.*[A-Z].*',
	numbers : '.*\\d.*',
}

policy.init = function (conditions) {
	pattern = `^.*`;

	Object.keys(conditions).forEach((key) => {
		if (!map[key]) {
			console.log("Unknown or Unidentified condition passed, exiting");
			return;
		}

		if (key && map[key]) {
			let unit =
				key === "size" ? `(?=\\w{${conditions[key]},})` : `(?=${map[key]})`;
			pattern += unit;
		}
	});

	pattern += `.*$`;

	pattern = new RegExp(pattern, "gm");
};

policy.satisfied = function (password) { 

	if (!password) 
		return false; 

	const input = password.trim (); 

	if (!input.match (pattern)) 
		return false; 

	return true; 
};

policy.findAnomaly = function (password) {

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

const map = new Map ();

const store = {};

store.set = (key, value) => {
	return map.set (key, value);
};

store.get = (key) => {
	return map.get (key);
};

store.size = () => {
	return map.size;
};

store.delete = (key) => {
	return map.delete (key);
};

module.exports = store;

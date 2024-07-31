export const split = (string, separator) => {
	return string.split(separator);
};

export const length = (array) => {
	return !array ? 0 : array.length;
};

export const limit = (array, limit) => {
	return array.slice(0, limit);
};

export const offset = (array, offset) => {
	return array.slice(offset);
};

export const uniq = (array) => {
	return [...new Set(array)];
};

export const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

export const push = (array, item) => {
	return [...array, item];
};

export const jsonify = (array) => {
	return JSON.stringify(array);
};

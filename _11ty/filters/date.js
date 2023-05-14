module.exports = {
	readableDate: (date) =>
		date.toLocaleDateString('en-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}),
	attributeDate: (date) => date.toISOString().slice(0, 10),
	isoDate: (date) => date.toISOString(),
};

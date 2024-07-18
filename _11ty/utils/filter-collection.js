let filteredCollectionsMemoization = {};

const getFilteredCollection = (collection, folder, limit = false) => {
	if (folder in filteredCollectionsMemoization) {
		// This collection already exists in memoization
		return filteredCollectionsMemoization[folder];
	} else {
		let filteredCollection = collection
			.getFilteredByGlob(`src/collections/${folder}/**/*.md`)
			.filter(
				(item) => !item.filePathStem.match(/^\/collections\/[^\/]+\/index$/)
			)
			.sort((a, b) => b.date - a.date); // TODO: deal with different sorts

		if (limit) {
			// Keep only a few items per collection for performance (useful in dev mode)
			filteredCollection = filteredCollection.slice(0, limit);
		}

		// Keep a copy of this collection in memoization for later reuse
		filteredCollectionsMemoization[folder] = filteredCollection;

		return filteredCollection;
	}
};

module.exports = getFilteredCollection;

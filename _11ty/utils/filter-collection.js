const filteredCollectionsMemoization = {};

export const getFilteredCollection = (collection, folder, limit = false) => {
	if (folder in filteredCollectionsMemoization) {
		// This collection already exists in memoization
		return filteredCollectionsMemoization[folder];
	}
	// TODO: deal with different sorts
	let filteredCollection = collection
		.getFilteredByGlob(`src/collections/${folder}/**/*.md`)
		.filter(
			(item) => !item.filePathStem.match(/^\/collections\/[^\/]+\/index$/),
		)
		.sort((a, b) => b.date - a.date);

	if (limit) {
		// Keep only a few items per collection for performance (useful in dev mode)
		filteredCollection = filteredCollection.slice(0, limit);
	}

	// Keep a copy of this collection in memoization for later reuse
	filteredCollectionsMemoization[folder] = filteredCollection;

	return filteredCollection;
};

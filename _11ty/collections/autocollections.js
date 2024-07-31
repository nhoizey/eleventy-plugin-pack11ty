const getFilteredCollection = await import('../utils/filter-collection.js');
const folders = await import('../utils/collection-folders.js');

const collections = {};

folders.forEach((folder) => {
	// Add a collection for each autocollection folder
	collections[folder] = (collection) =>
		getFilteredCollection(collection, folder, false);
});

if (folders.length > 0) {
	// Add a global collection with all autocollection folders
	collections['contents'] = (collection) =>
		getFilteredCollection(collection, `{${folders.join(',')}}`, false);
}

export default collections;

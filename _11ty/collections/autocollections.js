import { folders } from "../utils/collection-folders.js";
import { getFilteredCollection } from "../utils/filter-collection.js";

const collections = {};

for (const folder of folders()) {
	// Add a collection for each autocollection folder
	collections[folder] = (collection) =>
		getFilteredCollection(collection, folder, false);
}

if (folders.length > 0) {
	// Add a global collection with all autocollection folders
	collections.contents = (collection) =>
		getFilteredCollection(collection, `{${folders.join(",")}}`, false);
}

export const autoCollections = { ...collections };

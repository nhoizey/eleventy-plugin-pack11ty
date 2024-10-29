// https://github.com/11ty/eleventy/issues/316#issuecomment-441053919
// https://github.com/11ty/eleventy/issues/502#issuecomment-498234424

import moment from 'moment';
import { folders } from '../utils/collection-folders.js';
import { getFilteredCollection } from '../utils/filter-collection.js';

const titleCase = (word) => word.charAt(0).toUpperCase() + word.substr(1);

function makeDateFormatter(datePattern) {
	return (date) => moment(date).format(datePattern);
}

function generateItemsDateSet(items, dateFormatter) {
	const formattedDates = items.map((item) => {
		return dateFormatter(item.data.page.date);
	});
	return [...new Set(formattedDates)];
}

function getItemsByDate(items, date, dateFormatter) {
	return items.filter((item) => {
		return dateFormatter(item.data.page.date) === date;
	});
}

const contentByDateString = (items, dateFormatter) => {
	return generateItemsDateSet(items, dateFormatter).reduce(
		(collected, formattedDate) =>
			Object.assign({}, collected, {
				// lowercase to match month directory page.url
				[formattedDate.toLowerCase()]: getItemsByDate(
					items,
					formattedDate,
					dateFormatter,
				),
			}),
		{},
	);
};

const yearsWithContent = (collection) => {
	return generateItemsDateSet(collection, makeDateFormatter('YYYY'));
};

const contentsByMonth = (collection) => {
	return contentByDateString(collection, makeDateFormatter('YYYY/MM'));
};

const contentsByYear = (collection) => {
	return contentByDateString(collection, makeDateFormatter('YYYY'));
};

const collectionsList = {};

for (const collectionName of folders()) {
	collectionsList[`yearsWith${titleCase(collectionName)}`] = (collection) =>
		yearsWithContent(getFilteredCollection(collection, collectionName, false));

	// collections for yearly archives
	collectionsList[`${collectionName}ByYear`] = (collection) =>
		contentsByYear(getFilteredCollection(collection, collectionName, false));

	// collections for monthly archives
	collectionsList[`${collectionName}ByMonth`] = (collection) =>
		contentsByMonth(getFilteredCollection(collection, collectionName, false));
}

export const archives = { ...collectionsList };

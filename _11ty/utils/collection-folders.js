import fs from 'node:fs';

export const folders = () => {
	const foldersList = [];
	fs.readdirSync('src/collections', {
		encoding: 'utf8',
		withFileTypes: true,
	}).forEach((item) => {
		if (item.isDirectory()) {
			foldersList.push(item.name);
		}
	});
	console.dir(foldersList);
	return foldersList;
};

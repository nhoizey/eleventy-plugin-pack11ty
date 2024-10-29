import fs from "node:fs";

export const folders = () => {
	const foldersList = [];
	if (fs.existsSync("src/collections")) {
		const items = fs.readdirSync("src/collections", {
			encoding: "utf8",
			withFileTypes: true,
		});
		for (const item of items) {
			if (item.isDirectory()) {
				foldersList.push(item.name);
			}
		}
	}
	return foldersList;
};

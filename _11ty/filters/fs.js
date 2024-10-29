import fs from 'node:fs';
import path from 'node:path';

export const dirname = (filePath) => {
	return path.dirname(filePath);
};

export const exists = (filePath) => {
	return fs.existsSync(filePath);
};

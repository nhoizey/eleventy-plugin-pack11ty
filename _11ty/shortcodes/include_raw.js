// Because Nunjucks's include doesn't like CSS with "{#"

import fs from 'node:fs';

const memoizedIncludes = {};

export const include_raw = (file) => {
	if (file in memoizedIncludes) {
		return memoizedIncludes[file];
	} else {
		const content = fs.readFileSync(file, 'utf8');
		memoizedIncludes[file] = content;
		return content;
	}
};

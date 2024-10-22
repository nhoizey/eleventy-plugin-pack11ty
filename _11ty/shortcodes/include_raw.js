// Because Nunjucks's include doesn't like CSS with "{#"

import fs from 'node:fs';

let memoizedIncludes = {};

export const include_raw = (file) => {
	if (file in memoizedIncludes) {
		return memoizedIncludes[file];
	} else {
		let content = fs.readFileSync(file, 'utf8');
		memoizedIncludes[file] = content;
		return content;
	}
};

import fs from 'node:fs';

import { sharedSlugify } from '../utils/slugify.js';

export const tags = (collection) => {
	const tagsCollection = new Map();
	let max = 0;

	for (const item of collection.getAll()) {
		if ('tags' in item.data) {
			for (const tag of item.data.tags) {
				const number = (tagsCollection.get(tag) ?? 0) + 1;
				max = Math.max(max, number);
				tagsCollection.set(tag, number);
			}
		}
	}

	// We assume there is at least one tag with only one content
	const minLog = Math.log(1);
	const maxLog = Math.log(max);

	const tags = [];
	tagsCollection.forEach((number, tag) => {
		const factor = (Math.log(number) - minLog) / (maxLog - minLog);
		const tagSlug = sharedSlugify(tag, {
			decamelize: false,
			customReplacements: [['%', ' ']],
		});

		const newTag = {
			tag: tag,
			slug: tagSlug,
			number: number,
			factor: factor,
			step: Math.ceil(factor * 2) + 1,
		};

		const tagLogoPath = `assets/logos/${tagSlug}.png`;
		if (fs.existsSync(`src/${tagLogoPath}`)) {
			newTag.logo = tagLogoPath;
		}

		const tagContentPath = `src/tags/${tagSlug}.md`;
		if (fs.existsSync(tagContentPath)) {
			newTag.description = fs.readFileSync(tagContentPath, {
				encoding: 'utf8',
			});
		}

		tags.push(newTag);
	});

	tags.sort((a, b) => {
		return a.tag.localeCompare(b.tag, 'en', { ignorePunctuation: true });
	});

	return tags;
};

export const mainTags = (collection) => {
	const minContentsNumber = 10;
	const tagsCollection = new Map();
	let max = 0;

	for (const item of collection.getAll()) {
		if ('tags' in item.data) {
			const itemTags = item.data.tags;

			for (const tag of itemTags) {
				const number = (tagsCollection.get(tag) ?? 0) + 1;
				max = Math.max(max, number);
				tagsCollection.set(tag, number);
			}
		}
	}

	const minLog = Math.log(minContentsNumber);
	const maxLog = Math.log(max);

	const tags = [];
	tagsCollection.forEach((number, tag) => {
		if (number >= minContentsNumber) {
			const factor = (Math.log(number) - minLog) / (maxLog - minLog);
			tags.push({
				tag: tag,
				number: number,
				factor: factor,
				step: Math.ceil(factor * 2) + 1,
			});
		}
	});

	tags.sort((a, b) => {
		return a.tag.localeCompare(b.tag, 'en', { ignorePunctuation: true });
	});

	return tags;
};

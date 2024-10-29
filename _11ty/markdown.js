// ------------------------------------------------------------------------
// Markdown-it plugins and configurations
// ------------------------------------------------------------------------

import path from 'node:path';

import markdownIt from 'markdown-it';
import markdownItAbbr from 'markdown-it-abbr';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttributes from 'markdown-it-attrs';
import markdownItSpan from 'markdown-it-bracketed-spans';
import markdownItContainer from 'markdown-it-container';
import markdownItFootnote from 'markdown-it-footnote';

const { sharedSlugify } = await import(
	path.join(import.meta.dirname, 'utils/slugify.js')
);

const markdownItOptions = {
	html: true,
	breaks: true,
	linkify: true,
};

export function buildMarkdownIt(options = {}) {
	// - - - - - - - - - - - - - - - - - - - - - - -
	// Add anchor links to headings
	// - - - - - - - - - - - - - - - - - - - - - - -
	const markdownItAnchorOptions = {
		level: [...Array(6).keys()].slice(options.firstLevel),
		sharedSlugify,
		permalink: markdownItAnchor.permalink.linkAfterHeader({
			class: 'deeplink',
			symbol: '&#xa7;&#xFE0E;', // https://www.toptal.com/designers/htmlarrows/punctuation/
			style: 'visually-hidden',
			visuallyHiddenClass: 'visually-hidden',
			assistiveText: (title) => `Permalink to heading ${title}`,
			wrapper: ['<div class="heading-wrapper">', '</div>'],
		}),
	};

	// - - - - - - - - - - - - - - - - - - - - - - -
	// Shift headings from Markdown
	// Level 1 in Markdown becomes level options.firstLevel in HTML
	// taken from https://gist.github.com/rodneyrehm/4feec9af8a8635f7de7cb1754f146a39
	// - - - - - - - - - - - - - - - - - - - - - - -
	function getHeadingLevel(tagName) {
		let localTagName = tagName;
		if (tagName[0].toLowerCase() === 'h') {
			localTagName = tagName.slice(1);
		}

		return Number.parseInt(localTagName, 10);
	}
	function markdownItHeadingLevel(md, options) {
		let firstLevel = options.firstLevel;

		if (typeof firstLevel === 'string') {
			firstLevel = getHeadingLevel(firstLevel);
		}

		if (!firstLevel || Number.isNaN(firstLevel)) {
			return;
		}

		const levelOffset = firstLevel - 1;
		if (levelOffset < 1 || levelOffset > 6) {
			return;
		}

		md.core.ruler.push('adjust-heading-levels', (state) => {
			const tokens = state.tokens;
			for (let i = 0; i < tokens.length; i++) {
				if (tokens[i].type !== 'heading_close') {
					continue;
				}

				const headingOpen = tokens[i - 2];
				const headingClose = tokens[i];

				const currentLevel = getHeadingLevel(headingOpen.tag);
				const tagName = `h${Math.min(currentLevel + levelOffset, 6)}`;

				headingOpen.tag = tagName;
				headingClose.tag = tagName;
			}
		});
	}

	// - - - - - - - - - - - - - - - - - - - - - - -
	// Set Markdown-it options
	// - - - - - - - - - - - - - - - - - - - - - - -
	const mdIt = markdownIt(markdownItOptions);
	mdIt.disable('code');
	mdIt.use(markdownItHeadingLevel, options);
	mdIt.use(markdownItFootnote);
	mdIt.use(markdownItAnchor, markdownItAnchorOptions);
	mdIt.use(markdownItAttributes);
	mdIt.use(markdownItSpan);
	mdIt.use(markdownItAbbr);
	for (const container of options.containers) {
		mdIt.use(markdownItContainer, container);
	}

	return mdIt;
}

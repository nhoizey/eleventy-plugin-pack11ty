// ------------------------------------------------------------------------
// Markdown-it plugins and configurations
// ------------------------------------------------------------------------

import path from 'node:path';

import markdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttributes from 'markdown-it-attrs';
import markdownItSpan from 'markdown-it-bracketed-spans';
import markdownItContainer from 'markdown-it-container';
import markdownItAbbr from 'markdown-it-abbr';

const slugify = await import(
	path.join(import.meta.dirname, 'utils/slugify.js')
);

const markdownItOptions = {
	html: true,
	breaks: true,
	linkify: true,
};

export const buildMarkdownIt = (options = {}) => {
	// - - - - - - - - - - - - - - - - - - - - - - -
	// Add anchor links to headings
	// - - - - - - - - - - - - - - - - - - - - - - -
	const markdownItAnchorOptions = {
		level: [...Array(6).keys()].slice(options.firstLevel),
		slugify,
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
		if (tagName[0].toLowerCase() === 'h') {
			tagName = tagName.slice(1);
		}

		return parseInt(tagName, 10);
	}
	function markdownItHeadingLevel(md, options) {
		var firstLevel = options.firstLevel;

		if (typeof firstLevel === 'string') {
			firstLevel = getHeadingLevel(firstLevel);
		}

		if (!firstLevel || isNaN(firstLevel)) {
			return;
		}

		var levelOffset = firstLevel - 1;
		if (levelOffset < 1 || levelOffset > 6) {
			return;
		}

		md.core.ruler.push('adjust-heading-levels', function (state) {
			var tokens = state.tokens;
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i].type !== 'heading_close') {
					continue;
				}

				var headingOpen = tokens[i - 2];
				var headingClose = tokens[i];

				var currentLevel = getHeadingLevel(headingOpen.tag);
				var tagName = 'h' + Math.min(currentLevel + levelOffset, 6);

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
	options.containers.forEach((container) =>
		mdIt.use(markdownItContainer, container)
	);

	return mdIt;
};

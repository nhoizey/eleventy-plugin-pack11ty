'use strict';

const path = require('path');

const merge = require('deepmerge');
const glob = require('fast-glob');

const slugify = require(path.join(__dirname, '11ty/utils/slugify.js'));

module.exports = (eleventyConfig, userOptions = {}) => {
	// Initialize options
	const defaultOptions = {
		responsiver: false,
		minifyHtml: false,
		markdown: {
			firstLevel: 2,
			containers: ['info', 'success', 'warning', 'error'],
		},
	};

	const options = merge(defaultOptions, userOptions);

	// ------------------------------------------------------------------------
	// Add filters
	// ------------------------------------------------------------------------

	glob.sync(path.join(__dirname, '11ty/filters/*.js')).forEach((file) => {
		let filters = require(file);
		Object.keys(filters).forEach((name) => {
			eleventyConfig.addFilter(name, filters[name]);
		});
	});

	// ------------------------------------------------------------------------
	// Add Nunjucks shortcodes
	// ------------------------------------------------------------------------

	glob.sync(path.join(__dirname, '11ty/shortcodes/*.js')).forEach((file) => {
		let shortcodes = require(file);
		Object.keys(shortcodes).forEach((name) => {
			eleventyConfig.addNunjucksShortcode(name, shortcodes[name]);
		});
	});

	// ------------------------------------------------------------------------
	// Add paired shortcodes
	// ------------------------------------------------------------------------

	glob
		.sync(path.join(__dirname, '11ty/paired_shortcodes/*.js'))
		.forEach((file) => {
			let pairedShortcodes = require(file);
			Object.keys(pairedShortcodes).forEach((name) => {
				eleventyConfig.addPairedShortcode(name, pairedShortcodes[name]);
			});
		});

	// ------------------------------------------------------------------------
	// Add plugins
	// ------------------------------------------------------------------------

	eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-rss'));

	eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'));

	eleventyConfig.addPlugin(require('eleventy-plugin-embed-everything'), {
		youtube: {
			options: {
				lite: {
					css: {
						// TODO: make it configurable?
						path: '/assets/yt-lite/lite-yt-embed.css',
					},
					js: {
						// TODO: make it configurable?
						path: '/assets/yt-lite/lite-yt-embed.js',
					},
				},
			},
		},
	});

	if (options.responsiver !== false) {
		// Make HTML images responsive
		eleventyConfig.addPlugin(
			require('eleventy-plugin-images-responsiver'),
			options.responsiver
		);
	}

	// ------------------------------------------------------------------------
	// Copy some assets
	// ------------------------------------------------------------------------

	const passthroughCopyPaths = {};

	// Add Lite YouTube CSS and JS
	passthroughCopyPaths[path.join(__dirname, 'assets')] = 'assets';

	eleventyConfig.addPassthroughCopy(passthroughCopyPaths);

	// ------------------------------------------------------------------------
	// Add transforms
	// ------------------------------------------------------------------------

	if (options.minifyHtml) {
		// Minify HTML
		eleventyConfig.addTransform(
			'htmlmin',
			require(path.join(__dirname, '11ty/transforms/html_min.js'))
		);
	}

	// ------------------------------------------------------------------------
	// Markdown-it plugins and configurations
	// ------------------------------------------------------------------------

	const markdownIt = require('markdown-it');
	const markdownItFootnote = require('markdown-it-footnote');
	const markdownItAnchor = require('markdown-it-anchor');
	const markdownItAttributes = require('markdown-it-attrs');
	const markdownItSpan = require('markdown-it-bracketed-spans');
	const markdownItContainer = require('markdown-it-container');
	const markdownItAbbr = require('markdown-it-abbr');

	const markdownItOptions = {
		html: true,
		breaks: true,
		linkify: true,
	};

	// - - - - - - - - - - - - - - - - - - - - - - -
	// Add anchor links to headings
	// - - - - - - - - - - - - - - - - - - - - - - -
	const markdownItAnchorOptions = {
		level: [...Array(6).keys()].slice(options.markdown.firstLevel),
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
	// Level 1 in Markdown becomes level options.markdown.firstLevel in HTML
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
	mdIt.use(markdownItHeadingLevel, {
		firstLevel: options.markdown.firstLevel,
	});
	mdIt.use(markdownItFootnote);
	mdIt.use(markdownItAnchor, markdownItAnchorOptions);
	mdIt.use(markdownItAttributes);
	mdIt.use(markdownItSpan);
	mdIt.use(markdownItAbbr);
	options.markdown.containers.forEach((container) =>
		mdIt.use(markdownItContainer, container)
	);
	eleventyConfig.setLibrary('md', mdIt);
};

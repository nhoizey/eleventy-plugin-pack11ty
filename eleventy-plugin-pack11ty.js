'use strict';

const fs = require('fs');
const path = require('node:path');
const merge = require('deepmerge');
const glob = require('fast-glob');

module.exports = (eleventyConfig, userOptions = {}) => {
	// Initialize options
	const defaultOptions = {
		responsiver: false,
		minifyHtml: false,
		markdown: {
			firstLevel: 2,
			containers: ['info'],
		},
		collectionsLimit: false,
	};

	const options = merge(defaultOptions, userOptions);

	// ------------------------------------------------------------------------
	// Build collections
	// ------------------------------------------------------------------------

	glob.sync(path.join(__dirname, '_11ty/collections/*.js')).forEach((file) => {
		let collectionList = require(file);
		Object.keys(collectionList).forEach((name) => {
			eleventyConfig.addCollection(name, collectionList[name]);
		});
	});

	// ------------------------------------------------------------------------
	// Add filters
	// ------------------------------------------------------------------------

	glob.sync(path.join(__dirname, '_11ty/filters/*.js')).forEach((file) => {
		let filters = require(file);
		Object.keys(filters).forEach((name) => {
			eleventyConfig.addFilter(name, filters[name]);
		});
	});

	// ------------------------------------------------------------------------
	// Add Nunjucks shortcodes
	// ------------------------------------------------------------------------

	glob.sync(path.join(__dirname, '_11ty/shortcodes/*.js')).forEach((file) => {
		let shortcodes = require(file);
		Object.keys(shortcodes).forEach((name) => {
			eleventyConfig.addNunjucksShortcode(name, shortcodes[name]);
		});
	});

	// ------------------------------------------------------------------------
	// Add paired shortcodes
	// ------------------------------------------------------------------------

	glob
		.sync(path.join(__dirname, '_11ty/paired_shortcodes/*.js'))
		.forEach((file) => {
			let pairedShortcodes = require(file);
			Object.keys(pairedShortcodes).forEach((name) => {
				eleventyConfig.addPairedShortcode(name, pairedShortcodes[name]);
			});
		});

	// ------------------------------------------------------------------------
	// Manage Sass/CSS and JS assets
	// ------------------------------------------------------------------------

	eleventyConfig.addPlugin(require('./_11ty/assets'));

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
	// Copy YouTube Lite assets
	eleventyConfig.addPassthroughCopy({
		[path.join(__dirname, 'assets')]: 'assets',
	});

	if (options.responsiver !== false) {
		// Make HTML images responsive
		eleventyConfig.addPlugin(
			require('eleventy-plugin-images-responsiver'),
			options.responsiver
		);
	}

	// ------------------------------------------------------------------------
	// Copy static files: images, etc.
	// ------------------------------------------------------------------------

	// Copy all images from "collections" and "pages" folders
	eleventyConfig.addPassthroughCopy('src', {
		filter: [
			'{collections,pages}/**/*.{jpg,jpeg,png,gif,webp,avif,svg}',
			'static/**/*',
		],
		rename: (file) => file.replace(/(collections|pages|static)\//, ''),
	});

	// ------------------------------------------------------------------------
	// Add transforms
	// ------------------------------------------------------------------------

	if (options.minifyHtml) {
		// Minify HTML
		eleventyConfig.addTransform(
			'htmlmin',
			require(path.join(__dirname, '_11ty/transforms/html_min.js'))
		);
	}

	// ------------------------------------------------------------------------
	// Markdown-it plugins and configurations
	// ------------------------------------------------------------------------

	const buildMarkdownIt = require(path.join(__dirname, '_11ty/markdown.js'));
	const pack11tyMarkdownIt = buildMarkdownIt(options.markdown);
	eleventyConfig.setLibrary('md', pack11tyMarkdownIt);

	eleventyConfig.addFilter('markdownify', (markdownString) =>
		pack11tyMarkdownIt.render(markdownString)
	);

	// ------------------------------------------------------------------------
	// Set content layout
	// ------------------------------------------------------------------------

	eleventyConfig.addGlobalData('eleventyComputed.layout', () => {
		// if addGlobalData receives a function it will execute it immediately,
		// so we return a nested function for computed data
		// Cf https://github.com/11ty/eleventy/blob/44a48cb577f3db7174121631842a576849a0b757/src/Plugins/I18nPlugin.js#L226
		return (data) => {
			if (data.layout !== undefined && data.layout !== '') {
				// A layout has been set in the content Front Matter
				return data.layout;
			}

			// Default layout is a page
			let layout = 'pages';

			// Let's find if this content is in a collection folder
			const folderRegex = new RegExp(`^./src/collections/([^/]+)/.*$`);
			let matches = data.page.inputPath.match(folderRegex);

			if (matches) {
				let folder = matches[1];
				if (fs.existsSync(`src/_layouts/${folder}.njk`)) {
					layout = folder;
				}
			}
			return layout;
		};
	});

	// ------------------------------------------------------------------------
	// Set permalink
	// ------------------------------------------------------------------------

	eleventyConfig.addGlobalData('eleventyComputed.permalink', () => {
		return (data) => {
			if (data.permalink) {
				// A permalink has been set in the content Front Matter
				return data.permalink;
			}

			return (
				data.page.filePathStem
					.replace(/^\/(pages|collections)/, '')
					.replace(/\/index$/, '') + '/index.html'
			);
		};
	});
};

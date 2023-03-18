'use strict';

const path = require('path');

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
		debug: true,
		filter: ['**/*.{jpg,jpeg,png,gif}', '!static/**/*'],
		rename: (file) => file.replace(/(collections|pages)\//, ''),
	});

	// Copy all files (not just images) from "static" folder
	eleventyConfig.addPassthroughCopy('src', {
		debug: true,
		filter: ['static/**/*'],
		rename: (file) => file.replace(/static\//, ''),
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
	eleventyConfig.setLibrary('md', buildMarkdownIt(options.markdown));
};

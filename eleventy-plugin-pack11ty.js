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
	};

	const options = merge(defaultOptions, userOptions);

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
			require(path.join(__dirname, '_11ty/transforms/html_min.js'))
		);
	}

	// ------------------------------------------------------------------------
	// Markdown-it plugins and configurations
	// ------------------------------------------------------------------------

	const buildMarkdownIt = require(path.join(__dirname, '_11ty/markdown.js'));
	eleventyConfig.setLibrary('md', buildMarkdownIt(options.markdown));
};

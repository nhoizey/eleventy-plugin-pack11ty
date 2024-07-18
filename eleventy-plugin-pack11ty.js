'use strict';

const fs = require('fs');
const path = require('node:path');
const merge = require('deepmerge');
const glob = require('fast-glob');

const rootPath = process.cwd();

module.exports = (eleventyConfig, userOptions = {}) => {
	// Get Eleventy configured directories
	const eleventyDirs = eleventyConfig.dir;

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

	// Build specific collections from the project
	let projectCollections = [];
	glob
		.sync(path.join(rootPath, eleventyDirs.input, '_11ty/collections/*.js'))
		.forEach((file) => {
			let collectionList = require(file);
			Object.keys(collectionList).forEach((name) => {
				eleventyConfig.addCollection(name, collectionList[name]);
				projectCollections.push(name);
			});
		});

	// console.log('Collections provided by the project:');
	// console.dir(projectCollections);

	// Build collections from the plugin, if they were not already created by the project
	let pluginCollections = { added: [], notAdded: [] };
	glob.sync(path.join(__dirname, '_11ty/collections/*.js')).forEach((file) => {
		let collectionList = require(file);
		Object.keys(collectionList).forEach((name) => {
			if (!projectCollections.includes(name)) {
				eleventyConfig.addCollection(name, collectionList[name]);
				pluginCollections.added.push(name);
			} else {
				pluginCollections.notAdded.push(name);
			}
		});
	});

	// console.log('Collections provided or not by the plugin:');
	// console.dir(pluginCollections);

	// ------------------------------------------------------------------------
	// Add filters
	// ------------------------------------------------------------------------

	// Add specific filters from the project
	let projectFilters = [];
	glob
		.sync(path.join(rootPath, eleventyDirs.input, '_11ty/filters/*.js'))
		.forEach((file) => {
			let filters = require(file);
			Object.keys(filters).forEach((name) => {
				eleventyConfig.addFilter(name, filters[name]);
				projectFilters.push(name);
			});
		});

	// console.log('Filters provided by the project:');
	// console.dir(projectFilters);

	// Add filters from the plugin, if they were not already added by the project
	let pluginFilters = { added: [], notAdded: [] };
	glob.sync(path.join(__dirname, '_11ty/filters/*.js')).forEach((file) => {
		let filters = require(file);
		Object.keys(filters).forEach((name) => {
			if (!projectFilters.includes(name)) {
				eleventyConfig.addFilter(name, filters[name]);
				pluginFilters.added.push(name);
			} else {
				pluginFilters.notAdded.push(name);
			}
		});
	});

	// console.log('Filters provided or not by the plugin:');
	// console.dir(pluginFilters);

	// ------------------------------------------------------------------------
	// Add Nunjucks shortcodes
	// ------------------------------------------------------------------------

	// Add specific shortcodes from the project
	let projectShortcodes = [];
	glob
		.sync(path.join(rootPath, eleventyDirs.input, '_11ty/shortcodes/*.js'))
		.forEach((file) => {
			let shortcodes = require(file);
			Object.keys(shortcodes).forEach((name) => {
				eleventyConfig.addNunjucksShortcode(name, shortcodes[name]);
				projectShortcodes.push(name);
			});
		});

	// console.log('Shortcodes provided by the project:');
	// console.dir(projectShortcodes);

	// Add shortcodes from the plugin, if they were not already added by the project
	let pluginShortcodes = { added: [], notAdded: [] };
	glob.sync(path.join(__dirname, '_11ty/shortcodes/*.js')).forEach((file) => {
		let shortcodes = require(file);
		Object.keys(shortcodes).forEach((name) => {
			if (!projectShortcodes.includes(name)) {
				eleventyConfig.addNunjucksShortcode(name, shortcodes[name]);
				pluginShortcodes.added.push(name);
			} else {
				pluginShortcodes.notAdded.push(name);
			}
		});
	});

	// console.log('Shortcodes provided or not by the plugin:');
	// console.dir(pluginShortcodes);

	// ------------------------------------------------------------------------
	// Add paired shortcodes
	// ------------------------------------------------------------------------

	// Add specific paired shortcodes from the project
	let projectPairedShortcodes = [];
	glob
		.sync(
			path.join(rootPath, eleventyDirs.input, '_11ty/paired_shortcodes/*.js')
		)
		.forEach((file) => {
			let pairedShortcodes = require(file);
			Object.keys(pairedShortcodes).forEach((name) => {
				eleventyConfig.addNunjucksShortcode(name, shortcodes[name]);
				projectPairedShortcodes.push(name);
			});
		});

	// console.log('Paired shortcodes provided by the project:');
	// console.dir(projectPairedShortcodes);

	// Add paired shortcodes from the plugin, if they were not already added by the project
	let pluginPairedShortcodes = { added: [], notAdded: [] };
	glob
		.sync(path.join(__dirname, '_11ty/paired_shortcodes/*.js'))
		.forEach((file) => {
			let pairedShortcodes = require(file);
			Object.keys(pairedShortcodes).forEach((name) => {
				if (!projectPairedShortcodes.includes(name)) {
					eleventyConfig.addPairedShortcode(name, pairedShortcodes[name]);
					pluginPairedShortcodes.added.push(name);
				} else {
					pluginPairedShortcodes.notAdded.push(name);
				}
			});
		});

	// console.log('Paired shortcodes provided or not by the plugin:');
	// console.dir(pluginPairedShortcodes);

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
	eleventyConfig.addPassthroughCopy(eleventyDirs.input, {
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

	// Add markdownify filter with Markdown-it configuration
	eleventyConfig.addFilter('markdownify', (markdownString) =>
		pack11tyMarkdownIt.render(markdownString)
	);

	// Add markdown paired shortcode with shared Markdown-it configuration
	eleventyConfig.addPairedShortcode(
		'markdown',
		(markdownString, inline = null) =>
			inline
				? pack11tyMarkdownIt.renderInline(markdownString)
				: pack11tyMarkdownIt.render(markdownString)
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
			let layout = 'page';

			// Let's find if this content is in a collection folder
			const folderRegex = new RegExp(
				`^./${eleventyDirs.input}/collections/([^/]+)/.*$`
			);
			let matches = data.page.inputPath.match(folderRegex);

			if (matches) {
				let folder = matches[1];
				if (fs.existsSync(`${eleventyDirs.input}/_layouts/${folder}.njk`)) {
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

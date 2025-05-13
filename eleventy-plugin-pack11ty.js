import fs from "node:fs";
import path from "node:path";

import pkg from "./package.json" with { type: "json" };

import merge from "deepmerge";
import glob from "fast-glob";

import eleventyPluginRss from "@11ty/eleventy-plugin-rss";
import eleventyPluginSyntaxhighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import eleventyPluginEmbedEverything from "eleventy-plugin-embed-everything";
import eleventyPluginImagesResponsiver from "eleventy-plugin-images-responsiver";

import { assets } from "./_11ty/assets.js";
import { buildMarkdownIt } from "./_11ty/markdown.js";
import { htmlMinTransform } from "./_11ty/transforms/html_min.js";

const rootPath = process.cwd();

export default async (eleventyConfig, userOptions = {}) => {
	// First check if the plugin is used with a compatible version of Eleventy
	try {
		eleventyConfig.versionCheck(pkg["11ty"].compatibility);
	} catch (e) {
		console.error(
			`[eleventy-plugin-pack11ty] Plugin compatibility error ${e.message}`,
		);
		return;
	}

	// Get Eleventy configured directories
	const eleventyDirs = eleventyConfig.dir;

	// Initialize options
	const defaultOptions = {
		responsiver: false,
		minifyHtml: false,
		markdown: {
			firstLevel: 2,
			containers: ["info"],
		},
		collectionsLimit: false,
	};

	const options = merge(defaultOptions, userOptions);

	// ------------------------------------------------------------------------
	// Build collections
	// ------------------------------------------------------------------------

	// Build specific collections from the project
	const projectCollections = [];

	const projectCollectionFiles = await glob.async(
		path.join(rootPath, eleventyDirs.input, "_11ty/collections/*.js"),
	);

	const projectCollectionImportedFiles = await Promise.all(
		projectCollectionFiles.map((file) => import(file)),
	);

	for (const file of projectCollectionImportedFiles) {
		for (const [name, collection] of Object.entries(file)) {
			eleventyConfig.addCollection(name, collection);
			projectCollections.push(name);
		}
	}

	// TODO: use DEBUG
	// console.log('Collections provided by the project:');
	// console.dir(projectCollections);

	// Build collections from the plugin, if they were not already created by the project
	const pluginCollections = { added: [], notAdded: [] };

	const pluginCollectionFiles = await glob.async(
		path.join(import.meta.dirname, "_11ty/collections/*.js"),
	);

	const pluginCollectionImportedFiles = await Promise.all(
		pluginCollectionFiles.map((file) => import(file)),
	);

	for (const file of pluginCollectionImportedFiles) {
		for (const [name, collection] of Object.entries(file)) {
			if (["autoCollections", "archives"].includes(name)) {
				// These are sets of collections
				for (const [autoName, autoCollection] of Object.entries(collection)) {
					if (!projectCollections.includes(autoName)) {
						eleventyConfig.addCollection(autoName, autoCollection);
						pluginCollections.added.push(autoName);
					} else {
						pluginCollections.notAdded.push(autoName);
					}
				}
			} else {
				if (!projectCollections.includes(name)) {
					eleventyConfig.addCollection(name, collection);
					pluginCollections.added.push(name);
				} else {
					pluginCollections.notAdded.push(name);
				}
			}
		}
	}

	// TODO: use DEBUG
	// console.log('Collections provided or not by the plugin:');
	// console.dir(pluginCollections);

	// ------------------------------------------------------------------------
	// Add filters
	// ------------------------------------------------------------------------

	// Add specific filters from the project
	const projectFilters = [];

	const projectFilterFiles = await glob.async(
		path.join(rootPath, eleventyDirs.input, "_11ty/filters/*.js"),
	);

	const projectFiltersImportedFiles = await Promise.all(
		projectFilterFiles.map((file) => import(file)),
	);

	for (const file of projectFiltersImportedFiles) {
		for (const [name, filter] of Object.entries(file)) {
			eleventyConfig.addFilter(name, filter);
			projectFilters.push(name);
		}
	}

	// TODO: use DEBUG
	// console.log('Filters provided by the project:');
	// console.dir(projectFilters);

	// Add filters from the plugin, if they were not already added by the project
	const pluginFilters = { added: [], notAdded: [] };

	const pluginFilterFiles = await glob.async(
		path.join(import.meta.dirname, "_11ty/filters/*.js"),
	);

	const pluginFiltersImportedFiles = await Promise.all(
		pluginFilterFiles.map((file) => import(file)),
	);

	for (const file of pluginFiltersImportedFiles) {
		for (const [name, filter] of Object.entries(file)) {
			if (!projectFilters.includes(name)) {
				eleventyConfig.addFilter(name, filter);
				pluginFilters.added.push(name);
			} else {
				pluginFilters.notAdded.push(name);
			}
		}
	}

	// TODO: use DEBUG
	// console.log('Filters provided or not by the plugin:');
	// console.dir(pluginFilters);

	// ------------------------------------------------------------------------
	// Add Nunjucks shortcodes
	// ------------------------------------------------------------------------

	// Add specific shortcodes from the project
	const projectShortcodes = [];

	const projectShortcodeFiles = await glob.async(
		path.join(rootPath, eleventyDirs.input, "_11ty/shortcodes/*.js"),
	);

	const projectShortcodesImportedFiles = await Promise.all(
		projectShortcodeFiles.map((file) => import(file)),
	);

	for (const file of projectShortcodesImportedFiles) {
		for (const [name, shortcode] of Object.entries(file)) {
			eleventyConfig.addNunjucksShortcode(name, shortcode);
			projectShortcodes.push(name);
		}
	}

	// TODO: use DEBUG
	// console.log('Shortcodes provided by the project:');
	// console.dir(projectShortcodes);

	// Add shortcodes from the plugin, if they were not already added by the project
	const pluginShortcodes = { added: [], notAdded: [] };

	const pluginShortcodeFiles = await glob.async(
		path.join(import.meta.dirname, "_11ty/shortcodes/*.js"),
	);

	const pluginShortcodesImportedFiles = await Promise.all(
		pluginShortcodeFiles.map((file) => import(file)),
	);

	for (const file of pluginShortcodesImportedFiles) {
		for (const [name, shortcode] of Object.entries(file)) {
			if (!projectShortcodes.includes(name)) {
				eleventyConfig.addNunjucksShortcode(name, shortcode);
				pluginShortcodes.added.push(name);
			} else {
				pluginShortcodes.notAdded.push(name);
			}
		}
	}

	// TODO: use DEBUG
	// console.log('Shortcodes provided or not by the plugin:');
	// console.dir(pluginShortcodes);

	// ------------------------------------------------------------------------
	// Add paired shortcodes
	// ------------------------------------------------------------------------

	// Add specific paired shortcodes from the project
	const projectPairedShortcodes = [];

	const projectPairedShortcodeFiles = await glob.async(
		path.join(rootPath, eleventyDirs.input, "_11ty/paired_shortcodes/*.js"),
	);

	const projectPairedShortcodesImportedFiles = await Promise.all(
		projectPairedShortcodeFiles.map((file) => import(file)),
	);

	for (const file of projectPairedShortcodesImportedFiles) {
		for (const [name, shortcode] of Object.entries(file)) {
			eleventyConfig.addPairedShortcode(name, shortcode);
			projectPairedShortcodes.push(name);
		}
	}

	// TODO: use DEBUG
	// console.log('Paired shortcodes provided by the project:');
	// console.dir(projectPairedShortcodes);

	// Add paired shortcodes from the plugin, if they were not already added by the project
	const pluginPairedShortcodes = { added: [], notAdded: [] };

	const pluginPairedShortcodeFiles = await glob.async(
		path.join(import.meta.dirname, "_11ty/paired_shortcodes/*.js"),
	);

	const pluginPairedShortcodesImportedFiles = await Promise.all(
		pluginPairedShortcodeFiles.map((file) => import(file)),
	);

	for (const file of pluginPairedShortcodesImportedFiles) {
		for (const [name, shortcode] of Object.entries(file)) {
			if (!projectPairedShortcodes.includes(name)) {
				eleventyConfig.addPairedShortcode(name, shortcode);
				pluginPairedShortcodes.added.push(name);
			} else {
				pluginPairedShortcodes.notAdded.push(name);
			}
		}
	}

	// TODO: use DEBUG
	// console.log('Paired shortcodes provided or not by the plugin:');
	// console.dir(pluginPairedShortcodes);

	// ------------------------------------------------------------------------
	// Manage Sass/CSS and JS assets
	// ------------------------------------------------------------------------

	eleventyConfig.addPlugin(assets);

	// ------------------------------------------------------------------------
	// Add plugins
	// ------------------------------------------------------------------------

	eleventyConfig.addPlugin(eleventyPluginRss);

	eleventyConfig.addPlugin(eleventyPluginSyntaxhighlight);

	eleventyConfig.addPlugin(eleventyPluginEmbedEverything, {
		youtube: {
			options: {
				lite: {
					css: {
						// TODO: make it configurable?
						path: "/assets/vendors/lite-youtube-embed/lite-yt-embed.css",
					},
					js: {
						// TODO: make it configurable?
						path: "/assets/vendors/lite-youtube-embed/lite-yt-embed.js",
					},
				},
			},
		},
	});
	// Copy YouTube Lite assets
	eleventyConfig.addPassthroughCopy({
		[path.join(import.meta.dirname, "node_modules/lite-youtube-embed/src")]:
			"assets/vendors/lite-youtube-embed",
	});

	if (options.responsiver !== false) {
		// Make HTML images responsive
		eleventyConfig.addPlugin(
			eleventyPluginImagesResponsiver,
			options.responsiver,
		);
	}

	// ------------------------------------------------------------------------
	// Copy static files: images, etc.
	// ------------------------------------------------------------------------

	const IMAGES_GLOB = '**/*.{jpg,jpeg,png,gif,webp,avif,svg}';

	// Copy all images from "collections"
	eleventyConfig.addPassthroughCopy({ [`${eleventyDirs.input}/collections/`]: '/' }, {
		filter: [IMAGES_GLOB],
	});

	// Copy all images from "pages"
	eleventyConfig.addPassthroughCopy({ [`${eleventyDirs.input}/pages/`]: '/' }, {
		filter: [IMAGES_GLOB],
	});

	// Copy all static assets
	eleventyConfig.addPassthroughCopy({ [`${eleventyDirs.input}/static/`]: '/' });

	// ------------------------------------------------------------------------
	// Add transforms
	// ------------------------------------------------------------------------

	if (options.minifyHtml) {
		// Minify HTML
		eleventyConfig.addTransform("htmlmin", htmlMinTransform);
	}

	// ------------------------------------------------------------------------
	// Markdown-it plugins and configurations
	// ------------------------------------------------------------------------

	const pack11tyMarkdownIt = buildMarkdownIt(options.markdown);
	eleventyConfig.setLibrary("md", pack11tyMarkdownIt);

	// Add markdownify filter with Markdown-it configuration
	eleventyConfig.addFilter("markdownify", (markdownString) =>
		pack11tyMarkdownIt.render(markdownString),
	);

	// Add markdown paired shortcode with shared Markdown-it configuration
	eleventyConfig.addPairedShortcode(
		"markdown",
		(markdownString, inline = null) =>
			inline
				? pack11tyMarkdownIt.renderInline(markdownString)
				: pack11tyMarkdownIt.render(markdownString),
	);

	// ------------------------------------------------------------------------
	// Set content layout
	// ------------------------------------------------------------------------

	eleventyConfig.addGlobalData("eleventyComputed.layout", () => {
		// if addGlobalData receives a function it will execute it immediately,
		// so we return a nested function for computed data
		// Cf https://github.com/11ty/eleventy/blob/44a48cb577f3db7174121631842a576849a0b757/src/Plugins/I18nPlugin.js#L226
		return (data) => {
			if (data.layout !== undefined && data.layout !== "") {
				// A layout has been set in the content Front Matter
				return data.layout;
			}

			// Default layout is a page
			let layout = "pages";

			// Let's find if this content is in a collection folder
			const folderRegex = new RegExp(
				`^./${eleventyDirs.input}/collections/([^/]+)/.*$`,
			);
			const matches = data.page.inputPath.match(folderRegex);

			if (matches) {
				const folder = matches[1];
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

	eleventyConfig.addGlobalData("eleventyComputed.permalink", () => {
		return (data) => {
			if (data.permalink !== undefined && data.permalink !== "") {
				// A permalink has been set in the content Front Matter
				return data.permalink;
			}

			if (data.page.filePathStem.match(/^\/(pages|collections)/)) {
				return `${data.page.filePathStem
					.replace(/^\/(pages|collections)/, "")
					.replace(/\/index$/, "")}/index.html`;
			}

			return false;
		};
	});
};

import path from 'node:path';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// Builders
import * as sass from 'sass';
import postcss from 'postcss';
import esbuild from 'esbuild';

// Official Eleventy plugins
import { EleventyRenderPlugin } from '@11ty/eleventy';

export const assets = (eleventyConfig, userOptions = {}) => {
	// https://github.com/11ty/eleventy-plugin-bundle#bundle-sass-with-the-render-plugin
	// https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
	eleventyConfig.addPlugin(EleventyRenderPlugin);

	eleventyConfig.addBundle('css', {
		toFileDirectory: 'bundle',
	});
	eleventyConfig.addBundle('js', {
		toFileDirectory: 'bundle',
	});

	eleventyConfig.addTemplateFormats('scss');

	// https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
	// TODO: add sourcemap generation, see https://github.com/sass/dart-sass/issues/1594#issuecomment-1013208452
	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css',
		useLayouts: false,
		compile: async function (inputContent, inputPath) {
			if (!inputContent || inputContent.trim() === '') return;

			// Only convert Sass files from the Sass assets folder
			if (!inputPath.includes('src/assets/sass')) return;

			const parsed = path.parse(inputPath);
			let sassResult;

			try {
				sassResult = sass.compileString(inputContent, {
					loadPaths: [parsed.dir || '.', 'src/assets/sass', 'node_modules'],
					style: 'expanded',
					sourceMap: false,
				});
			} catch (error) {
				console.error('############## Error!');
				console.dir(error);
			}

			this.addDependencies(inputPath, sassResult.loadedUrls);

			return async (data) => {
				if (data.eleventy.env.runMode === 'build') {
					// Use PostCSS for Autoprefixer and cssnano when building for production
					let postCssResult = await postcss([
						autoprefixer,
						cssnano({
							preset: ['default', { discardComments: { removeAll: true } }],
						}),
					]).process(sassResult.css, { from: inputPath });

					return postCssResult.css;
				} else {
					return sassResult.css;
				}
			};
		},
		compileOptions: {
			permalink: (contents, inputPath) => {
				// Don't convert Sass files with filenames starting with a '_'
				// https://www.11ty.dev/docs/languages/custom/#compileoptions.permalink-to-override-permalink-compilation
				let parsed = path.parse(inputPath);
				if (parsed.name.startsWith('_')) {
					return false;
				}
			},
		},
	});

	eleventyConfig.addTemplateFormats('js');

	// Ignore JS files from _11ty
	eleventyConfig.ignores.add('./src/_11ty');

	eleventyConfig.addExtension('js', {
		outputFileExtension: 'js',
		read: false,
		compile: async function (inputContent, inputPath) {
			if (!inputContent) return;

			// Only convert JS files from the JS assets folder
			if (!inputPath.includes('src/assets/js')) return;

			return async (data) => {
				const output = await esbuild.build({
					entryPoints: [inputPath],
					// nodePaths: ['.', 'src/assets/js'],
					bundle: true,
					format: 'esm',
					target: 'es6',
					minify: data.eleventy.env.runMode === 'build',
					write: false,
					external: ['fs'],
				});

				return output.outputFiles[0].text;
			};
		},
		compileOptions: {
			permalink: false,
		},
	});
};

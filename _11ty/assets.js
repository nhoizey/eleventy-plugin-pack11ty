const path = require('node:path');

// Builders
const sass = require('sass');
const postcss = require('postcss');
const esbuild = require('esbuild');

// Official Eleventy plugins
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const EleventyBundlePlugin = require('@11ty/eleventy-plugin-bundle');

module.exports = (eleventyConfig, userOptions = {}) => {
	eleventyConfig.addPlugin(EleventyBundlePlugin);

	// https://github.com/11ty/eleventy-plugin-bundle#bundle-sass-with-the-render-plugin
	// https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
	eleventyConfig.addPlugin(EleventyRenderPlugin);

	eleventyConfig.addTemplateFormats('scss');

	// https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
	// TODO: add sourcemap generation, see https://github.com/sass/dart-sass/issues/1594#issuecomment-1013208452
	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css',
		compile: async function (inputContent, inputPath) {
			const parsed = path.parse(inputPath);

			// Only convert Sass files from the Sass assets folder
			if (!inputPath.includes('src/assets/sass')) return;

			// Don't convert Sass files with filenames starting with a '_'
			if (parsed.name.startsWith('_')) return;

			return async (data) => {
				let sassResult = sass.compileString(inputContent, {
					loadPaths: [parsed.dir || '.', 'src/assets/sass', 'node_modules'],
					style: 'expanded',
					sourceMap: false,
				});

				if (data.eleventy.env.runMode === 'build') {
					// Use PostCSS for Autoprefixer and cssnano when building for production
					let postCssResult = await postcss([
						require('autoprefixer'),
						require('cssnano')({
							preset: ['default', { discardComments: { removeAll: true } }],
						}),
					]).process(sassResult.css, { from: inputPath });

					return postCssResult.css;
				} else {
					return sassResult.css;
				}
			};
		},
	});

	eleventyConfig.addTemplateFormats('js');

	// Ignore JS files from _11ty
	eleventyConfig.ignores.add('./src/_11ty');

	eleventyConfig.addExtension('js', {
		outputFileExtension: 'js',
		read: false,
		compile: async function (inputContent, inputPath) {
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
	});
};

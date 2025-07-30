# [ [Pack11ty](https://pack11ty.dev) ] `eleventy-plugin-pack11ty`

[![npm](https://img.shields.io/npm/v/eleventy-plugin-pack11ty?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/eleventy-plugin-pack11ty)
[![npm](https://img.shields.io/npm/dw/eleventy-plugin-pack11ty?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/eleventy-plugin-pack11ty)
[![GitHub stars](https://img.shields.io/github/stars/nhoizey/eleventy-plugin-pack11ty.svg?style=for-the-badge&logo=github)](https://github.com/nhoizey/eleventy-plugin-pack11ty/stargazers)
[![Follow @nhoizey@mamot.fr](https://img.shields.io/mastodon/follow/000262395?domain=https%3A%2F%2Fmamot.fr&style=for-the-badge&logo=mastodon&logoColor=white&color=6364FF)](https://mamot.fr/@nhoizey)

[Pack11ty](https://pack11ty.dev) is an heavily opinionated **[Eleventy](https://www.11ty.dev/) starter** (aka "template project").

`eleventy-plugin-pack11ty` is an Eleventy plugin containing a set of filters, shortcodes, transforms and plugins for Eleventy, used in the Pack11ty starter, but also usable in any other Eleventy project.

Feel free to use it, enhance it, and share your ideas/comments with [issues](https://github.com/nhoizey/eleventy-plugin-pack11ty/issues/new/choose), or (even better) [pull requests](https://github.com/nhoizey/eleventy-plugin-pack11ty/compare).

## Installation

You can either use the [Pack11ty](https://pack11ty.dev) starter, or install the plugin into your existing Eleventy project:

```shell
npm install --save-dev eleventy-plugin-pack11ty
```

Then, in your Eleventy configuration file (usually `.eleventy.js` or `eleventy.config.js`), load the plugin as follows:

```js
import eleventyPluginPack11ty from 'eleventy-plugin-pack11ty';

export default async function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyPluginPack11ty);
};
```

## Usage

### Options

You can set some options for the plugin to activate and configure some features, including [transforms](#transforms).

Change the previous code to this and replace the `false` values as you wish:

```js
import eleventyPluginPack11ty from 'eleventy-plugin-pack11ty';

export default async function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyPluginPack11ty, {
		responsiver: false,
		minifyHtml: false,
	});
};
```

| **Option name**       | **Description**                                                                                                                                                                                           | **Value**                                                                                      |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| `responsiver`         | Transform simple `<img src="…">` images into responsive images with `srcset`/`sizes` attributes with [eleventy-plugin-images-responsiver](https://nhoizey.github.io/eleventy-plugin-images-responsiver/). | `false` (default) or an object with multiple keys. See details in the Tranforms section below. |
| `minifyHtml`          | Minify the HTML after building pages. Recommended for a production build only.                                                                                                                            | `false` (default) or `true`                                                                    |
| `markdown.firstLevel` | Define which HTML heading level to use for the first heading level in Markdown files.                                                                                                                     | `2` (default) or another value                                                                 |
| `markdown.containers` | Define containers to add to Markdown                                                                                                                                                                      | `["info"]` (default) or an array of strings.                                                   |
| `passthroughCopy`     | Copy static files to the output folder.                                                                                                                                                                   | `true` (default) or `false`                                                                    |
| `passthroughCopyGlob` | Define which static files to copy frml the `collections` and `pages` subfolders. All content of the `static` folder will always be copied.                                                                | `"**/*.{jpg,jpeg,png,gif,webp,avif,svg}"` (default)                                            |

### Generate drafts only locally

### Time zone and locale

### Filters

#### Arrays

#### Strings

#### HTML

### Nunjucks shortcodes

### Paired shortcode

### Transforms

#### Responsive images

#### Minify HTML

### Included plugins

## Would you like to know more?

Read the full documentation on [pack11ty.dev](https://pack11ty.dev/)!

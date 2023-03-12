# [ Pack11ty ] `eleventy-plugin-pack11ty`

[Pack11ty](https://pack11ty.dev) is an heavily opinionated [Eleventy](https://www.11ty.dev/) starter (aka "template project") created by [Nicolas Hoizey](https://nicolas-hoizey.com/).

`eleventy-plugin-pack11ty` is an Eleventy plugin containing a set of filters, shortcodes, transforms and plugins for Eleventy, used in the Pack11ty starter, but also usable in any other Eleventy project.

Feel free to use it, enhance it, and share your ideas/comments with [issues](https://github.com/nhoizey/eleventy-plugin-pack11ty/issues/new/choose), or (even better) [pull requests](https://github.com/nhoizey/eleventy-plugin-pack11ty/compare).

## Installation

You can either use the [Pack11ty](https://pack11ty.dev) starter, or install the plugin into your existing Eleventy project:

```shell
npm install --save-dev eleventy-plugin-pack11ty
```

Then, in your Eleventy configuration file (usually `.eleventy.js` or `eleventy.config.js`), load the plugin as follows:

```js
const pack11tyPlugin = require("eleventy-plugin-pack11ty");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pack11tyPlugin, {
    responsiver: false,
    minifyHtml: false,
  });
};
```

## Usage

### Options

Options you can set for the plugin are used to activate and configure some [transforms](#transforms).

| **Option name** | **Description**                                                                                                                                                                                           | **Value**                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `responsiver`   | Transform simple `<img src="…">` images into responsive images with `srcset`/`sizes` attributes with [eleventy-plugin-images-responsiver](https://nhoizey.github.io/eleventy-plugin-images-responsiver/). | An object with multiple keys. See details in the Tranforms section below. |
| `minifyHtml`    | Minify the HTML after building pages. Recommended for a production build only.                                                                                                                            | `false` (default) or `true`                                               |

### Filters

#### Arrays

#### Strings

#### HTML

### Nunjucks shortcodes

### Paired shortcode

### Transforms

### Included plugins

## Would you like to know more?

Read the full documentation on [pack11ty.dev](https://pack11ty.dev/)!

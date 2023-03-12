# Pack11ty: `eleventy-plugin-pack11ty`

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
  eleventyConfig.addPlugin(pack11tyPlugin);
};
```

## Usage

### Filters

### Nunjucks shortcodes

### Paired shortcode

### Transforms

### Included plugins

## Would you like to know more?

Read the full documentation on [pack11ty.dev](https://pack11ty.dev/)!

"use strict";

const glob = require("fast-glob");

module.exports = (eleventyConfig, options = {}) => {
  /* ************************************************************
  /* Add filters
  /* ************************************************************ */

  glob.sync("filters/*.js").forEach((file) => {
    let filters = require("./" + file);
    Object.keys(filters).forEach((name) => {
      eleventyConfig.addFilter(name, filters[name]);
    });
  });

  /* ************************************************************
  /* Add Nunjucks shortcodes
  /* ************************************************************ */

  glob.sync("shortcodes/*.js").forEach((file) => {
    let shortcodes = require("./" + file);
    Object.keys(shortcodes).forEach((name) => {
      eleventyConfig.addNunjucksShortcode(name, shortcodes[name]);
    });
  });

  /* ************************************************************
  /* Add paired shortcodes
  /* ************************************************************ */

  glob.sync("paired_shortcodes/*.js").forEach((file) => {
    let pairedShortcodes = require("./" + file);
    Object.keys(pairedShortcodes).forEach((name) => {
      eleventyConfig.addPairedShortcode(name, pairedShortcodes[name]);
    });
  });

  /* ************************************************************
  /* Add plugins
  /* ************************************************************ */

  const rss = require("@11ty/eleventy-plugin-rss");
  eleventyConfig.addPlugin(rss);
};

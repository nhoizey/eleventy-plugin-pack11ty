"use strict";

const path = require("path");
const glob = require("fast-glob");

module.exports = (eleventyConfig) => {
  /* ************************************************************
  /* Add filters
  /* ************************************************************ */

  glob.sync(path.join(__dirname, "filters/*.js")).forEach((file) => {
    console.log(file);
    let filters = require(file);
    Object.keys(filters).forEach((name) => {
      eleventyConfig.addFilter(name, filters[name]);
    });
  });

  /* ************************************************************
  /* Add Nunjucks shortcodes
  /* ************************************************************ */

  glob.sync(path.join(__dirname, "shortcodes/*.js")).forEach((file) => {
    let shortcodes = require(file);
    Object.keys(shortcodes).forEach((name) => {
      eleventyConfig.addNunjucksShortcode(name, shortcodes[name]);
    });
  });

  /* ************************************************************
  /* Add paired shortcodes
  /* ************************************************************ */

  glob.sync(path.join(__dirname, "paired_shortcodes/*.js")).forEach((file) => {
    let pairedShortcodes = require(file);
    Object.keys(pairedShortcodes).forEach((name) => {
      eleventyConfig.addPairedShortcode(name, pairedShortcodes[name]);
    });
  });

  /* ************************************************************
  /* Add plugins
  /* ************************************************************ */

  const rss = require("@11ty/eleventy-plugin-rss");
  eleventyConfig.addPlugin(rss);

  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);
};

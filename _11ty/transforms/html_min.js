import htmlmin from 'html-minifier';

	if (!this.page.outputPath || !this.page.outputPath.endsWith('.html')) {
		return content;
export function htmlMinTransform(content) {
	}

	return htmlmin.minify(content, {
		useShortDoctype: true,
		removeComments: true,
		collapseWhitespace: true,
		minifyCSS: false,
	});
};

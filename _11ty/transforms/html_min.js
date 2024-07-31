import htmlmin from 'html-minifier';

export const htmlMinTransform = (content) => {
	if (!this.page.outputPath || !this.page.outputPath.endsWith('.html')) {
		return content;
	}

	return htmlmin.minify(content, {
		useShortDoctype: true,
		removeComments: true,
		collapseWhitespace: true,
		minifyCSS: false,
	});
};

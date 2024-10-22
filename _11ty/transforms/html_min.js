import htmlmin from 'html-minifier-terser';

export function htmlMinTransform(content) {
	if ((this.page.outputPath || '').endsWith('.html')) {
		return htmlmin.minify(content, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true,
			minifyCSS: false,
		});
	}

	// Not an HTML file
	return content;
}

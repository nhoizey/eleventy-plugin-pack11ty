import truncateHtmlPackage from "truncate-html";

export const cleanDeepLinks = (content) => {
	if (content === undefined) {
		return "";
	}
	const regex = / <a class="deeplink"((?!(<\/a>)).|\n)+<\/a>/gm;
	return content.replace(regex, "");
};

export const excerpt = (content) => {
	if (content === undefined) {
		return "";
	}
	const regex = /(<p( [^>]*)?>((?!(<\/p>)).|\n)+<\/p>)/m;
	let excerpt = "";

	// Remove paragraphs containing only an image
	const cleanContent = content.replace(/<p><img [^>]+><\/p>/, "");

	// Get first paragraph, if there's at least one, and remove the paragraph tag
	const matches = regex.exec(cleanContent);
	if (matches !== null) {
		excerpt = matches[0].replace(/<p( [^>]*)?>(((?!(<\/p>)).|\n)+)<\/p>/, "$2");
	}

	return excerpt;
};

export const truncateHtml = (html, length) => {
	return truncateHtmlPackage(html, length, {
		reserveLastWord: true,
		ellipsis: "…",
	});
};

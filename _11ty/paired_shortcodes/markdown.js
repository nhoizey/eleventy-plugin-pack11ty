import markdownIt from "markdown-it";

export const markdown = (content, inline = null) => {
	return inline ? markdownIt.renderInline(content) : markdownIt.render(content);
};

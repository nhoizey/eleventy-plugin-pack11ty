const sharedSlugify = await import('../utils/slugify.js');

export const slugify = (string) => sharedSlugify(string);

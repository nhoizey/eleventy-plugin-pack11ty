// Add a "navigation" collection with all auto collection homepages
export const navigation = (collection) =>
	collection
		.getAll()
		.filter((item) => "nav" in item.data && "order" in item.data.nav)
		.sort(
			(a, b) =>
				Number.parseInt(a.data.nav.order, 10) -
				Number.parseInt(b.data.nav.order, 10),
		);

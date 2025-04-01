import { MarkdownInstance } from 'astro';

export const formatDate = (pubDate: string) => {
	var options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	};

	return new Date(pubDate).toLocaleDateString('es-SV', options);
};

export const sortPostsByDate = (a: MarkdownInstance<any>, b: MarkdownInstance<any>) => {
	// First, check if either post is pinned
	const isPinnedA = a.frontmatter.isPinned === true;
	const isPinnedB = b.frontmatter.isPinned === true;

	// If one is pinned and the other isn't, prioritize the pinned one
	if (isPinnedA && !isPinnedB) {
		return -1;
	}
	if (!isPinnedA && isPinnedB) {
		return 1;
	}

	// If both are pinned or both are not pinned, sort by date
	const pubDateA = new Date(a.frontmatter.pubDate);
	const pubDateB = new Date(b.frontmatter.pubDate);
	if (pubDateA < pubDateB) {
		return 1;
	}
	if (pubDateA > pubDateB) {
		return -1;
	}
	return 0;
};

export const getFilteredCollectionEntries = (
	collection: MarkdownInstance<any>[]
): {
	entries: MarkdownInstance<any>[];
} => {
	const data = collection.filter((post: any) => !post.frontmatter.draft).sort(sortPostsByDate);

	return { entries: data };
};

export const getNavigationEntries = (
	collection: MarkdownInstance<any>[],
	referenceSlug: string | undefined
) => {
	if (!referenceSlug) {
		return {};
	}

	const { entries } = getFilteredCollectionEntries(collection);
	const currentIndex = entries.findIndex((entry) => entry.url === referenceSlug);

	return {
		nextPost: entries[currentIndex + 1],
		prevPost: entries[currentIndex - 1]
	};
};

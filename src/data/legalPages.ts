import pages from "../../seo/legal-pages.json";
export type LegalPageData = (typeof pages)[number];
export const legalPages = pages as LegalPageData[];
export const legalPageBySlug = Object.fromEntries(legalPages.map((page) => [page.slug, page])) as Record<string, LegalPageData>;

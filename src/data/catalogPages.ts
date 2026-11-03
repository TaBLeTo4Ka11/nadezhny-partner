import pages from "../../seo/catalog-pages.json";
export type CatalogPageData = (typeof pages)[number];
export const catalogPages = pages as CatalogPageData[];
export const catalogPageBySlug = Object.fromEntries(catalogPages.map((page) => [page.slug, page])) as Record<string, CatalogPageData>;
export const catalogPageByTitle = Object.fromEntries(catalogPages.map((page) => [page.title, page])) as Record<string, CatalogPageData>;

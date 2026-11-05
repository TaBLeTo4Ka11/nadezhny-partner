import pages from "../../seo/catalog-pages.json";

export interface Product {
  id: string;
  name: string;
  description: string;
  specs: string[];
  images: string[];
  colors: string[];
  price: string | null;
}

export type CatalogPageData = (typeof pages)[number];
export const catalogPages = pages as CatalogPageData[];
export const catalogPageBySlug = Object.fromEntries(catalogPages.map((page) => [page.slug, page])) as Record<string, CatalogPageData>;
export const catalogPageByTitle = Object.fromEntries(catalogPages.flatMap((page) => [page.title, ...(page.catalogLabels || [])].map((label) => [label, page]))) as Record<string, CatalogPageData>;

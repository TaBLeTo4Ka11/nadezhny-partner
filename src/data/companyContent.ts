import catalogSource from "./replit-catalog.json";
import factsSource from "./replit-company-facts.json";

type SourceCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description?: string;
};
type SourceProduct = {
  id: number;
  name: string;
  slug: string;
  image: string;
  images?: string[];
  categoryIds: number[];
  url?: string;
};

const categories = catalogSource.categories as SourceCategory[];
const products = catalogSource.products as SourceProduct[];
const facts = factsSource as typeof factsSource & {
  company: { brand: string; description: string; history: string; homepageCopy: string; advantages: { title: string; copy: string }[] };
  contacts: { email: string; additionalEmail: string; address: string; hours: string; phone: string; phoneTel: string; directPhone: string; directPhoneTel: string };
  production: { intro: string; steps: { title: string; copy: string }[]; customOrders: string };
  reviews: { name: string; rating: number; text: string }[];
};

export const company = {
  name: facts.company.brand,
  experience: "15+",
  email: facts.contacts.additionalEmail || facts.contacts.email,
  address: facts.contacts.address,
  phones: [
    { label: facts.contacts.phone, href: "tel:88002228837" },
    { label: facts.contacts.directPhone, href: "tel:84932345017" },
  ],
  hours: facts.contacts.hours,
  website: "/",
};

const topLevelCategories = categories.filter((category) => category.parent === 0 && ![15, 94].includes(category.id));

export const catalog = topLevelCategories.map((parent) => {
  const childCategories = categories.filter((category) => category.parent === parent.id);
  const relatedProducts = products.filter((product) => product.categoryIds?.includes(parent.id));
  return {
    group: parent.name,
    items: [...new Set([
      ...childCategories.map((category) => category.name),
      ...relatedProducts.map((product) => product.name.replace(/&#8212;|&#x2014;/g, "—").replace(/&amp;/g, "&")),
    ])],
  };
});

export const catalogUrls: Record<string, string> = Object.fromEntries(
  categories.map((category) => [category.name, `/catalog/${category.slug}/`]),
);

// Category IDs from the source catalog define the product/category relationship.
export const catalogCategories = categories
  .filter((category) => category.parent !== 0)
  .map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentName: categories.find((parent) => parent.id === category.parent)?.name ?? "",
    products: products
      .filter((product) => product.categoryIds?.includes(category.id))
      .map((product) => ({
        id: product.id,
        title: product.name.replace(/&#8212;|&#x2014;/g, "—").replace(/&amp;/g, "&"),
        slug: product.slug,
        image: product.image,
        images: product.images ?? [],
      })),
  }));

export const productImages = [
  {
    title: "Противопожарная дверь ДМП-2 EIS60",
    src: "/images/products/dmp-2-eis60-dver-metallicheskaya-protivopozharnaya-dvupolnaya-01.png",
    href: "/catalog/protivopozharnye-dveri/",
  },
  {
    title: "Бронированная дверь ДР-I",
    src: "/images/products/dr-i-01.png",
    href: "/catalog/dveri-zashhitnye/",
  },
  {
    title: "Входная дверь DOMINANTA",
    src: "/images/products/dominanta-muar-yasen-seryj-emal-01.png",
    href: "/catalog/dveri-metall-mdf/",
  },
  {
    title: "Полнотелый деревянный дверной блок",
    src: "/images/products/dvernye-bloki-polnotelye-s-zamkom-i-petlyami-v-komplekte-02.jpg",
    href: "/catalog/polnotelye-derevyannye-dveri/",
  },
  {
    title: "Фурнитура «Антипаника»",
    src: "/images/products/apeks-rv-1700-s-panic-bl-red-ruchka-shtanga-s-tyagami-vtoraya-stvorka-01.webp",
    href: "/catalog/furnitura-dlya-protivopozharnyh-dverej/",
  },
];

export const workImages: string[] = [];

export const productionImages = Array.from(
  { length: 13 },
  (_, index) => `/images/production/production-${String(index + 1).padStart(2, "0")}.jpeg`,
);

export const about = [
  facts.company.homepageCopy,
  facts.company.description,
  facts.company.history,
  facts.production.customOrders,
];

export const productionStages = facts.production.steps.map((step) => ({
  title: step.title,
  text: step.copy,
}));

export const reviews = facts.reviews.map((review) => ({
  author: review.name,
  rating: `${review.rating} / 5`,
  text: review.text,
}));

export const catalogProductLinks = products
  .filter((product) => product.categoryIds?.includes(97))
  .map((product) => ({
    title: product.name.replace(/&#8212;|&#x2014;/g, "—").replace(/&amp;/g, "&"),
    category: "Банковские лотки",
    sourceUrl: product.slug,
    localPath: `/product/${product.slug}/`,
  }));

export const verifiedCategoryProducts = catalogProductLinks.map((product) => ({
  title: product.title,
  category: product.category,
  href: product.localPath,
  localPath: product.localPath,
}));

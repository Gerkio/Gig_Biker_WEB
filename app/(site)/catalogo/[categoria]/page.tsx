import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CatalogGrid } from "@/components/catalog-grid";
import { getProducts } from "@/lib/data";
import { categoriesNav } from "@/lib/config";
import type { CategorySlug } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

const validSlugs = categoriesNav.map((c) => c.slug);

// Descripciones SEO por categoría (concisas, con intención de búsqueda).
const CATEGORY_SEO: Record<string, string> = {
  jerseys: "Jerseys para motociclismo de alto desempeño. Tela técnica y transpirable. Envíos a toda Colombia.",
  chaquetas: "Chaquetas reflectivas, cortavientos e impermeables para moto. Máxima visibilidad y protección.",
  tubulares: "Tubulares y balaclavas multifuncionales para moto: protección facial contra sol, viento y polvo.",
  accesorios: "Accesorios para motociclismo: gorras, riñoneras, maletas drybag y más. Calidad garantizada.",
};

export function generateStaticParams() {
  return categoriesNav.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const cat = categoriesNav.find((c) => c.slug === categoria);
  if (!cat) return buildMetadata({ title: "Catálogo", path: "/catalogo" });
  return buildMetadata({
    title: cat.title,
    description: CATEGORY_SEO[cat.slug],
    path: `/catalogo/${cat.slug}`,
  });
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  if (!validSlugs.includes(categoria as CategorySlug)) notFound();

  const cat = categoriesNav.find((c) => c.slug === categoria)!;
  const products = await getProducts(categoria as CategorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <JsonLd
        data={[
          itemListSchema(products, `/catalogo/${cat.slug}`),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/catalogo" },
            { name: cat.title, path: `/catalogo/${cat.slug}` },
          ]),
        ]}
      />
      <header className="mb-8">
        <p className="text-sm uppercase tracking-widest text-brand-yellow">
          Categoría
        </p>
        <h1 className="heading-display text-4xl sm:text-5xl">{cat.title}</h1>
      </header>
      <Suspense fallback={null}>
        <CatalogGrid products={products} lockedCategory={categoria as CategorySlug} />
      </Suspense>
    </div>
  );
}

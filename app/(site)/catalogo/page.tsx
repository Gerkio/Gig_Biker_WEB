import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogGrid } from "@/components/catalog-grid";
import { getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Catálogo",
  description: "Explora jerseys, chaquetas, tubulares y accesorios para motociclismo. Envíos a toda Colombia.",
  path: "/catalogo",
});

export default async function CatalogoPage() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <JsonLd
        data={[
          itemListSchema(products, "/catalogo"),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/catalogo" },
          ]),
        ]}
      />
      <header className="mb-8">
        <h1 className="heading-display text-4xl sm:text-5xl">
          Catálogo <span className="text-brand-yellow">completo</span>
        </h1>
        <p className="mt-2 text-zinc-400">
          Filtra y encuentra lo que tu moto necesita.
        </p>
      </header>
      <Suspense fallback={null}>
        <CatalogGrid products={products} />
      </Suspense>
    </div>
  );
}

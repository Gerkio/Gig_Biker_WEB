import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Star, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductViewTracker } from "@/components/trackers";
import { ProductSlider } from "@/components/product-slider";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { getAllProductSlugs, getProduct, getProducts } from "@/lib/data";
import { discountPct, formatCOP } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, productSchema } from "@/lib/structured-data";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return buildMetadata({ title: "Producto", path: `/producto/${slug}` });
  return buildMetadata({
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.description,
    path: `/producto/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const off = discountPct(product.price, product.compareAtPrice);
  const gallery =
    product.gallery && product.gallery.length
      ? product.gallery
      : [product.image, product.hoverImage].filter(Boolean) as string[];

  // Relacionados (misma categoria, excluyendo el actual)
  const related = (await getProducts(product.category))
    .filter((p) => p._id !== product._id)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/catalogo" },
            { name: product.category, path: `/catalogo/${product.category}` },
            { name: product.title, path: `/producto/${product.slug}` },
          ]),
        ]}
      />
      <ProductViewTracker slug={product.slug} title={product.title} />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-zinc-500">
        <Link href="/catalogo" className="hover:text-brand-yellow">
          Catálogo
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/catalogo/${product.category}`} className="capitalize hover:text-brand-yellow">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-400">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={gallery} alt={product.title} />

        <div>
          {product.brand && (
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
              {product.brand}
            </p>
          )}
          <h1 className="heading-display mt-1 text-3xl sm:text-4xl">
            {product.title}
          </h1>

          {product.rating && (
            <div className="mt-2 flex items-center gap-1 text-sm text-zinc-400">
              <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
              {product.rating.toFixed(1)} · Producto verificado
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-bold text-white">
              {formatCOP(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-zinc-500 line-through">
                {formatCOP(product.compareAtPrice)}
              </span>
            )}
            {off && <Badge tone="red">-{off}%</Badge>}
          </div>

          <p className="mt-5 leading-relaxed text-zinc-300">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductPurchase product={product} />
          </div>

          {/* Garantias */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-brand-yellow" /> Envíos a todo el país
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-yellow" /> Producto
              original
            </div>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <h2 className="heading-display mb-8 text-3xl">
              También te puede <span className="text-brand-yellow">gustar</span>
            </h2>
          </Reveal>
          <ProductSlider products={related} />
        </section>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { categoriesNav, site } from "@/lib/config";
import { cn } from "@/lib/utils";

// Link de nav con subrayado amarillo animado + estado activo.
function NavLink({
  href,
  active,
  className,
  children,
}: {
  href: string;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors",
        active ? "text-brand-yellow" : "text-zinc-200 hover:text-brand-yellow",
        className
      )}
    >
      {children}
      <span
        className={cn(
          "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left bg-brand-yellow transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const openCart = useCart((s) => s.openCart);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");

  function doSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/catalogo?q=${encodeURIComponent(q)}`);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animacion "bump" del contador cuando cambia la cantidad
  useEffect(() => {
    if (totalItems === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(t);
  }, [totalItems]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-ink-900/90 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={site.logo}
            alt={site.name}
            width={120}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink href="/catalogo" active={pathname === "/catalogo"}>
            Catálogo
          </NavLink>
          {categoriesNav.map((c) => (
            <NavLink
              key={c.slug}
              href={`/catalogo/${c.slug}`}
              active={pathname === `/catalogo/${c.slug}`}
            >
              {c.title}
            </NavLink>
          ))}
          <Link
            href="/promociones"
            className="ml-1 flex items-center gap-1 rounded-full bg-brand-red px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:brightness-110 hover:shadow-[0_0_18px_-4px_rgba(197,47,51,0.8)]"
          >
            🔥 Ofertas
          </Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded p-2 text-zinc-200 hover:text-brand-yellow"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            aria-label="Carrito"
            onClick={openCart}
            className="relative rounded p-2 text-zinc-200 hover:text-brand-yellow"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <motion.span
                animate={bump ? { scale: [1, 1.4, 1] } : {}}
                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded p-2 text-zinc-200 hover:text-brand-yellow lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-ink-900"
          >
            <form onSubmit={doSearch} className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 lg:px-8">
              <Search className="h-5 w-5 shrink-0 text-zinc-400" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Busca chaquetas, gorras, tubulares…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
              <button type="submit" className="rounded-md bg-brand-yellow px-4 py-1.5 text-xs font-bold uppercase text-brand-black">
                Buscar
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav movil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-ink-900 lg:hidden"
          >
            <div className="flex flex-col p-4">
              <Link href="/catalogo" onClick={() => setMobileOpen(false)} className="py-2 uppercase tracking-wide">
                Catálogo
              </Link>
              {categoriesNav.map((c) => (
                <Link
                  key={c.slug}
                  href={`/catalogo/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 uppercase tracking-wide"
                >
                  {c.title}
                </Link>
              ))}
              <Link href="/promociones" onClick={() => setMobileOpen(false)} className="py-2 font-bold uppercase tracking-wide text-brand-red">
                Ofertas
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

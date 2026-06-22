import type { Metadata } from "next";

// El carrito no debe indexarse (página transaccional/privada).
export const metadata: Metadata = {
  title: "Carrito",
  robots: { index: false, follow: false },
};

export default function CarritoLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

// La confirmación de orden no debe indexarse.
export const metadata: Metadata = {
  title: "Orden confirmada",
  robots: { index: false, follow: false },
};

export default function ConfirmacionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

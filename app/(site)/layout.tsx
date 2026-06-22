import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartSheet } from "@/components/cart-sheet";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { AnnouncementBar } from "@/components/announcement-bar";
import { PageViewTracker } from "@/components/trackers";
import { getSiteSettings } from "@/lib/data";

// Layout del sitio publico (con chrome). El Studio en /studio queda fuera
// de este grupo y se renderiza limpio, a pantalla completa.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <PageViewTracker />
      <AnnouncementBar messages={settings?.announcements} />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartSheet />
      <WhatsAppFloat />
    </>
  );
}

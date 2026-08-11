import { ScribbleBackground } from "@/components/ScribbleBackground";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScribbleBackground />
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </>
  );
}

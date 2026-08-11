import { ScribbleBackground } from "@/components/ScribbleBackground";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col">
      <ScribbleBackground />
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

/**
 * Admin chrome — deliberately separate from the public site's Header/Footer/
 * scribble background (PRD Section 6: Admin is "private, not in public
 * navigation," not part of the themed public site). Only wraps the
 * authenticated dashboard routes; /admin/login sits outside this route
 * group so it stays chrome-free.
 */
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <header className="border-b border-charcoal/15 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <nav className="flex items-center gap-6 text-sm">
            <span className="font-medium">Nineteenandfree Admin</span>
            <Link href="/admin" className="underline-offset-2 hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/moderation" className="underline-offset-2 hover:underline">
              Moderation
            </Link>
          </nav>
          <AdminLogoutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

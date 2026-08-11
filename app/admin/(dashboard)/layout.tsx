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
      <header className="border-b border-charcoal/15 px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
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

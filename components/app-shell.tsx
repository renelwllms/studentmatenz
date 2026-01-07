import Link from "next/link";

const nav = [
  { href: "/app/admin", label: "Dashboard" },
  { href: "/app/admin/students", label: "Students" },
  { href: "/app/admin/packages", label: "Packages" },
  { href: "/app/admin/blogs", label: "Blogs" },
  { href: "/app/admin/templates", label: "Templates" },
  { href: "/app/admin/settings", label: "Settings" },
];

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white/80 p-6 lg:flex">
          <Link href="/" className="font-display text-2xl">
            StudentMate
          </Link>
          <nav className="mt-8 flex flex-col gap-3 text-sm font-medium text-slate-600">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin</p>
              <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            </div>
            <div className="text-sm text-slate-500">Search</div>
          </header>
          <main className="px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

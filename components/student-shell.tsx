import Link from "next/link";

export function StudentShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4">
        <Link href="/" className="font-display text-xl">
          StudentMate
        </Link>
        <div className="text-sm text-slate-500">Student Portal</div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

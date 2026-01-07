import Link from "next/link";

const links = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/70 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-display text-2xl">StudentMate NZ</div>
          <p className="mt-2 max-w-md text-sm text-foreground/70">
            Premium settlement guidance for international students across Aotearoa.
          </p>
          <p className="mt-4 text-xs text-foreground/60">
            We are not licensed immigration advisers. We provide settlement guidance and practical support only.
          </p>
          <p className="mt-2 text-xs text-foreground/60">
            Emergency: Call 111 for Police/Fire/Ambulance in New Zealand.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/70 hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/app/login" className="text-foreground/70 hover:text-foreground">
            Student Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}

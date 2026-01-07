"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current) {
        return;
      }

      if (!headerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 w-full border-b border-white/60 bg-white/70 backdrop-blur"
    >
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 sm:py-4">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/studentmate-logo.png"
            alt="StudentMate NZ"
            width={1392}
            height={370}
            className="h-6 w-auto sm:h-12 md:h-14 max-h-[60px]"
            priority
          />
          <span className="sr-only">StudentMate NZ</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/70 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/app/login"
            className="hidden text-sm font-semibold text-foreground/70 transition hover:text-foreground md:block"
          >
            Portal Login
          </Link>
          <Link href="https://wa.me/6421841446" aria-label="Book a call on WhatsApp">
            <Button>
              <span className="hidden sm:inline">Book a Call</span>
              <span className="inline-flex items-center sm:hidden" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.12.86.32 1.7.59 2.51a2 2 0 0 1-.45 2.11L9.91 10.91a16 16 0 0 0 4.18 4.18l1.56-1.56a2 2 0 0 1 2.11-.45c.81.27 1.65.47 2.51.59A2 2 0 0 1 22 16.92Z" />
                </svg>
              </span>
            </Button>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-foreground/10 bg-white/80 p-2 text-foreground/70 transition hover:text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <div
        id="mobile-nav"
        className={`border-t border-white/60 bg-white/95 px-6 py-4 text-sm font-medium text-foreground/80 shadow-sm lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/app/login"
            className="text-sm font-semibold text-foreground/70 transition hover:text-foreground md:hidden"
            onClick={() => setOpen(false)}
          >
            Portal Login
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            <Button className="w-full">Book a Call</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

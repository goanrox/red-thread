"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/cases", label: "Cases" },
  { href: "/profile", label: "Detective" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsMenuOpen(false), [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200",
          isScrolled || isMenuOpen ? "nav-glass" : "bg-transparent border-b border-transparent"
        )}
        style={{ height: "var(--nav-h)" }}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-[15px] font-serif text-[color:var(--color-text)] hover:opacity-80 transition-opacity"
          >
            <span
              aria-hidden
              className="inline-block h-[2px] w-4 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <span>Red Thread</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <DesktopLink key={item.href} href={item.href} current={pathname}>
                {item.label}
              </DesktopLink>
            ))}
            <Link href="/cases" className="btn btn-secondary ml-3">
              Open Case File
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] text-[color:var(--color-text)] hover:bg-[color:var(--color-surface)] transition-colors"
          >
            {isMenuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 md:hidden animate-fade-in"
          style={{ paddingTop: "var(--nav-h)", background: "var(--color-bg)" }}
        >
          <nav aria-label="Mobile" className="px-4 py-4 flex flex-col">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-[var(--radius)] px-4 py-4 text-[17px] font-medium transition-colors",
                    active
                      ? "text-[color:var(--color-text)] bg-[color:var(--color-surface)]"
                      : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface)]"
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--color-accent)" }}
                    />
                  )}
                </Link>
              );
            })}
            <Link href="/cases" className="btn btn-primary mt-3 w-full">
              Open Case File
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function DesktopLink({
  href,
  current,
  children,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
}) {
  const active = isActive(current, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "px-3 h-9 inline-flex items-center rounded-[var(--radius)] text-[14px] font-medium transition-colors",
        active
          ? "text-[color:var(--color-text)] bg-[color:var(--color-surface)]"
          : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)] hover:bg-[color:var(--color-surface)]"
      )}
    >
      {children}
    </Link>
  );
}

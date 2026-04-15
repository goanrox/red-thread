"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-24 transition-all duration-700",
        isScrolled
          ? "py-5 glass shadow-2xl"
          : "py-10 bg-transparent"
      )}
    >
      {/* Wordmark */}
      <Link href="/" className="flex items-center gap-4 group">
        <span
          className="transition-all duration-500 group-hover:w-12"
          style={{
            display: "block",
            height: "0.5px",
            width: "32px",
            background: "linear-gradient(to right, #d4af37, rgba(212,175,55,0.3))",
          }}
        />
        <span className="text-sm font-serif italic tracking-[0.3em] text-ivory/90 group-hover:text-brass transition-colors duration-500">
          Red Thread
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-10">
        <NavLink href="/cases" current={pathname}>
          Cases
        </NavLink>
        <NavLink href="/profile" current={pathname}>
          Detective
        </NavLink>
        <Link
          href="/cases"
          className="px-5 py-2 border border-brass/20 rounded-sm text-[9px] font-display uppercase tracking-[0.35em] text-brass/60 hover:text-brass hover:border-brass/40 transition-all duration-500"
        >
          Case File
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-brass/50 hover:text-brass transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass border-t border-brass/10 px-8 py-6 flex flex-col gap-5 md:hidden">
          <MobileNavLink href="/cases" onClick={() => setIsMenuOpen(false)}>
            Cases
          </MobileNavLink>
          <MobileNavLink href="/profile" onClick={() => setIsMenuOpen(false)}>
            Detective
          </MobileNavLink>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
}) {
  const isActive =
    current === href || (href !== "/" && current.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "text-[9px] font-display uppercase tracking-[0.4em] relative group transition-colors duration-500",
        isActive ? "text-brass" : "text-ivory/40 hover:text-brass"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-2 left-0 h-[0.5px] bg-brass/60 transition-all duration-500 origin-left",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-[9px] font-display uppercase tracking-[0.4em] text-ivory/50 hover:text-brass transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

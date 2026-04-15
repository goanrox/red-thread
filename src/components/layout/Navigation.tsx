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
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 transition-all duration-500",
        isScrolled ? "py-4 glass" : "py-6 bg-transparent"
      )}
    >
      {/* Logo / Wordmark */}
      <Link href="/" className="flex items-center gap-3 group shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-400 group-hover:scale-105"
          style={{
            background:
              "radial-gradient(circle at 38% 32%, #e03545 0%, #c1272d 55%, #8a1c22 100%)",
            boxShadow:
              "0 2px 10px rgba(193,39,45,0.45), inset 0 1px 0 rgba(255,255,255,0.22)",
          }}
        >
          <span
            className="font-serif italic font-bold text-ivory/90 select-none"
            style={{ fontSize: "11px", letterSpacing: "0.03em" }}
          >
            RT
          </span>
        </div>
        <span className="hidden sm:block font-serif italic text-[15px] tracking-wide text-ivory/80 group-hover:text-ivory transition-colors duration-300">
          Red Thread
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-9">
        <NavLink href="/cases" current={pathname}>Cases</NavLink>
        <NavLink href="/about" current={pathname}>Method</NavLink>
        <NavLink href="/profile" current={pathname}>Profile</NavLink>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-ivory/50 hover:text-ivory transition-colors p-2 -mr-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass border-t border-[#2e2926]/50 px-6 py-6 flex flex-col gap-5 md:hidden">
          <MobileNavLink href="/cases" onClick={() => setIsMenuOpen(false)}>Cases</MobileNavLink>
          <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>Method</MobileNavLink>
          <MobileNavLink href="/profile" onClick={() => setIsMenuOpen(false)}>Profile</MobileNavLink>
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
        "relative text-[11px] font-display uppercase tracking-[0.18em] transition-colors duration-300 group",
        isActive ? "text-ivory" : "text-ivory/40 hover:text-ivory/75"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1.5 left-0 h-px transition-all duration-350 origin-left",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )}
        style={{ background: "#c1272d" }}
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
      className="text-sm font-display uppercase tracking-[0.18em] text-ivory/55 hover:text-ivory transition-colors duration-200 py-1"
    >
      {children}
    </Link>
  );
}

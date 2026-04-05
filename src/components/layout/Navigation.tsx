"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#2a2a45]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="font-serif text-xl text-parchment tracking-wider group-hover:text-gold transition-colors duration-200"
            style={{ fontWeight: 500 }}
          >
            Red Thread
          </span>
          <span
            className="hidden sm:block h-px w-8 opacity-40 group-hover:opacity-80 transition-opacity duration-300"
            style={{ background: "linear-gradient(to right, #c9a84c, transparent)" }}
          />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          <NavLink href="/cases" current={pathname}>
            Cases
          </NavLink>
          <NavLink href="/profile" current={pathname}>
            Detective
          </NavLink>
        </div>
      </div>
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
        "label-caps transition-colors duration-200 relative group",
        isActive ? "text-gold" : "text-mist hover:text-parchment"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-[1px] left-0 right-0 h-px transition-transform duration-200 origin-left",
          isActive
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100"
        )}
        style={{ background: "linear-gradient(to right, #c9a84c, transparent)" }}
      />
    </Link>
  );
}

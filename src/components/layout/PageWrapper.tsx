import { cn } from "@/lib/utils";
import type { WithClassName, WithChildren } from "@/types";

export function PageWrapper({ children, className }: WithClassName & WithChildren) {
  return (
    <div className={cn("relative min-h-screen bg-void", className)}>
      {/* Atmospheric noise overlay — subtle texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

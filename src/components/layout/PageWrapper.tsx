import { cn } from "@/lib/utils";
import type { WithClassName, WithChildren } from "@/types";

export function PageWrapper({ children, className }: WithClassName & WithChildren) {
  return (
    <div className={cn("relative min-h-screen bg-void", className)}>
      {/* Film-grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Ambient radial glow — gold, top-left */}
      <div
        className="pointer-events-none fixed animate-float"
        style={{
          top: "30%",
          left: "10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
        }}
        aria-hidden="true"
      />

      {/* Ambient radial glow — crimson, bottom-right */}
      <div
        className="pointer-events-none fixed animate-float"
        style={{
          top: "70%",
          right: "5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(139,34,50,0.07) 0%, transparent 65%)",
          transform: "translate(50%, -50%)",
          borderRadius: "50%",
          animationDelay: "-3s",
        }}
        aria-hidden="true"
      />

      {/* Corner accent marks */}
      <div className="pointer-events-none fixed top-8 left-8 h-4 w-4 border-t border-l border-brass/15 z-20" aria-hidden="true" />
      <div className="pointer-events-none fixed top-8 right-8 h-4 w-4 border-t border-r border-brass/15 z-20" aria-hidden="true" />
      <div className="pointer-events-none fixed bottom-8 left-8 h-4 w-4 border-b border-l border-brass/15 z-20" aria-hidden="true" />
      <div className="pointer-events-none fixed bottom-8 right-8 h-4 w-4 border-b border-r border-brass/15 z-20" aria-hidden="true" />

      {/* Crimson signal dot — bottom right */}
      <div className="pointer-events-none fixed bottom-10 right-10 flex items-center gap-3 z-30" aria-hidden="true">
        <div className="relative h-1.5 w-1.5">
          <div className="absolute inset-0 bg-red-900 rounded-full opacity-40 animate-pulse" />
          <div className="absolute inset-0 bg-red-600 rounded-full scale-50" />
        </div>
        <span className="text-[7px] font-display uppercase tracking-[0.4em] text-ivory/20">Signal Active</span>
      </div>

      {children}
    </div>
  );
}

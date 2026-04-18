import { cn } from "@/lib/utils";
import type { WithClassName, WithChildren } from "@/types";

export function PageWrapper({ children, className }: WithClassName & WithChildren) {
  return (
    <div
      className={cn("relative min-h-screen", className)}
      style={{ background: "var(--color-bg)" }}
    >
      {children}
    </div>
  );
}

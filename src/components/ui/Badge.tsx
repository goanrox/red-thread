import { cn } from "@/lib/utils";
import type { WithClassName } from "@/types";

type BadgeVariant = "gold" | "crimson" | "iris" | "mist" | "surface";

interface BadgeProps extends WithClassName {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:    "bg-gold/10 text-gold border-gold/20",
  crimson: "bg-crimson/10 text-crimson-light border-crimson/20",
  iris:    "bg-iris/10 text-iris border-iris/20",
  mist:    "bg-surface2 text-mist border-border",
  surface: "bg-surface border-border text-shadow",
};

export function Badge({ variant = "mist", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 label-caps",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

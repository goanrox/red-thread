import { cn } from "@/lib/utils";
import type { WithClassName } from "@/types";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends WithClassName, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-void font-semibold hover:bg-gold-light border border-gold hover:border-gold-light",
  secondary:
    "bg-surface2 text-parchment border border-border hover:border-gold hover:text-gold",
  ghost:
    "bg-transparent text-mist border border-transparent hover:border-border hover:text-parchment",
  danger:
    "bg-crimson text-parchment border border-crimson hover:bg-crimson-light hover:border-crimson-light",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs rounded-xl",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

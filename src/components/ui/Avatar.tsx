import { cn } from "@/lib/utils";
import type { WithClassName } from "@/types";

interface AvatarProps extends WithClassName {
  name: string;
  size?: "sm" | "md" | "lg";
}

const GRADIENT_PAIRS = [
  ["#c9a84c", "#8b2232"],
  ["#6b63d4", "#c9a84c"],
  ["#8b2232", "#6b63d4"],
  ["#2a2a45", "#6b63d4"],
  ["#c9a84c", "#6b63d4"],
];

function getGradient(name: string): string {
  const idx = name.charCodeAt(0) % GRADIENT_PAIRS.length;
  const [from, to] = GRADIENT_PAIRS[idx];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-sans font-semibold text-void",
        sizeClasses[size],
        className
      )}
      style={{ background: getGradient(name) }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

import { cn, clamp } from "@/lib/utils";
import type { WithClassName } from "@/types";

interface ProgressBarProps extends WithClassName {
  value: number; // 0–100
  label?: string;
  showValue?: boolean;
  color?: "gold" | "crimson" | "iris";
}

const colorClasses = {
  gold:   "bg-gold",
  crimson: "bg-crimson",
  iris:   "bg-iris",
};

export function ProgressBar({ value, label, showValue, color = "gold", className }: ProgressBarProps) {
  const clamped = clamp(value, 0, 100);
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="label-caps">{label}</span>}
          {showValue && <span className="label-caps text-parchment">{clamped}%</span>}
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface3">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClasses[color])}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { WithClassName } from "@/types";

export function Divider({ className }: WithClassName) {
  return <div className={cn("divider-gold my-6", className)} aria-hidden="true" />;
}

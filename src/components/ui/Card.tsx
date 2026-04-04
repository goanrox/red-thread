import { cn } from "@/lib/utils";
import type { WithClassName, WithChildren } from "@/types";

interface CardProps extends WithClassName, WithChildren {
  hoverable?: boolean;
  as?: "div" | "article" | "section";
}

export function Card({ className, children, hoverable = false, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-border bg-surface p-6",
        hoverable && "card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </Tag>
  );
}

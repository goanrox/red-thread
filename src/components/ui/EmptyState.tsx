import { cn } from "@/lib/utils";
import type { WithClassName } from "@/types";

interface EmptyStateProps extends WithClassName {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}>
      {icon && <span className="text-4xl opacity-40">{icon}</span>}
      <div>
        <p className="font-serif text-xl text-mist">{title}</p>
        {description && <p className="mt-1 text-sm text-shadow">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

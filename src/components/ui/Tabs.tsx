"use client";

import { cn } from "@/lib/utils";
import type { WithClassName } from "@/types";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps extends WithClassName {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <nav
      className={cn("flex gap-1 rounded-xl border border-border bg-surface p-1", className)}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded-lg px-4 py-2 label-caps transition-colors duration-200",
            activeTab === tab.id
              ? "bg-surface3 text-parchment"
              : "text-shadow hover:text-mist"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

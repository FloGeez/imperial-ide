import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tab } from "@/lib/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface EditorTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export function EditorTabs({
  tabs,
  activeTab,
  onTabSelect,
  onTabClose,
}: EditorTabsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <ScrollArea className="h-9">
      <div className="h-full flex items-center gap-1 px-2 bg-card/50 border-b border-border/50 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "group flex items-center gap-2 px-3 py-1 text-sm border-b-2 cursor-pointer",
              activeTab === tab.id
                ? "text-primary border-primary bg-primary/10"
                : "text-muted-foreground border-transparent hover:text-foreground hover:border-border/50"
            )}
            onClick={() => onTabSelect(tab.id)}
          >
            <span
              className={cn(
                "truncate",
                isMobile ? "max-w-[80px]" : "max-w-[120px]"
              )}
            >
              {tab.label}
            </span>
            <button
              className="opacity-0 group-hover:opacity-100 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

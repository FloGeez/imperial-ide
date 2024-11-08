import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  isExplorerOpen: boolean;
  onToggleExplorer: () => void;
}

export function TopBar({ isExplorerOpen, onToggleExplorer }: TopBarProps) {
  return (
    <div className="h-14 border-b border-blue-500/20 bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="effect-hover"
          onClick={onToggleExplorer}
        >
          {isExplorerOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border border-blue-500/20">
          <img src="/icon.svg" alt="Logo" className="h-7 w-7" />
          <h1 className="text-lg font-bold text-primary star-wars-title effect-text-glow">
            IMPERIAL_IDE
          </h1>
        </div>
      </div>
    </div>
  );
}

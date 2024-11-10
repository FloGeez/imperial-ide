import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import iconSvg from "@/assets/icon.svg";
import HyperText from "../ui/hyper-text";

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
          <img src={iconSvg} alt="Logo" className="h-7 w-7" />
          <HyperText
            text="IMPERIAL_IDE"
            className="text-lg font-bold text-primary imperial-ide-title effect-text-glow"
          />
        </div>
      </div>
    </div>
  );
}

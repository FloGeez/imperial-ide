import { Code, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  currentView: "editor" | "preview_and_terminal";
  onViewChange: (view: "editor" | "preview_and_terminal") => void;
}

export function MobileNavigation({
  currentView,
  onViewChange,
}: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 p-2 flex justify-around">
      <Button
        variant={currentView === "editor" ? "default" : "ghost"}
        size="icon"
        className="h-12 w-12 transition-all duration-200"
        onClick={() => onViewChange("editor")}
      >
        <Code className="h-5 w-5" />
      </Button>
      <Button
        variant={currentView === "preview_and_terminal" ? "default" : "ghost"}
        size="icon"
        className="h-12 w-12 transition-all duration-200"
        onClick={() => onViewChange("preview_and_terminal")}
      >
        <Eye className="h-5 w-5" />
      </Button>
    </div>
  );
}

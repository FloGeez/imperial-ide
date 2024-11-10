import { EditorTabs } from "../Editor/EditorTabs";
import { CodeEditor } from "../Editor/CodeEditor";
import { Tab } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface EditorPanelProps {
  tabs: Tab[];
  activeTab: string;
  activeTabContent: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onCodeChange: (code: string) => void;
  isExplorerOpen: boolean;
  onToggleExplorer: () => void;
}

export function EditorPanel({
  tabs,
  activeTab,
  activeTabContent,
  onTabSelect,
  onTabClose,
  onCodeChange,
  isExplorerOpen,
  onToggleExplorer,
}: EditorPanelProps) {
  const getLanguageFromFileName = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "jsx":
      case "tsx":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      default:
        return "plaintext";
    }
  };

  return (
    <div className="h-full flex flex-col bg-card/50">
      <div className="flex items-center gap-2 px-2 bg-card/50 border-b border-border/50">
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="effect-hover h-7 w-7"
            onClick={onToggleExplorer}
            title={
              isExplorerOpen
                ? "Fermer l'explorateur de fichiers"
                : "Ouvrir l'explorateur de fichiers"
            }
          >
            {isExplorerOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
        <EditorTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabSelect={onTabSelect}
          onTabClose={onTabClose}
        />
      </div>
      {activeTab ? (
        <CodeEditor
          value={activeTabContent}
          onChange={onCodeChange}
          language={getLanguageFromFileName(
            tabs.find((t) => t.id === activeTab)?.label || ""
          )}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Sélectionnez un fichier à éditer
        </div>
      )}
    </div>
  );
}

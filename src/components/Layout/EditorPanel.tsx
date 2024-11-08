import { EditorTabs } from "../Editor/EditorTabs";
import { CodeEditor } from "../Editor/CodeEditor";
import { Tab } from "@/lib/types";

interface EditorPanelProps {
  tabs: Tab[];
  activeTab: string;
  activeTabContent: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onCodeChange: (code: string) => void;
}

export function EditorPanel({
  tabs,
  activeTab,
  activeTabContent,
  onTabSelect,
  onTabClose,
  onCodeChange,
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
      <EditorTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabSelect={onTabSelect}
        onTabClose={onTabClose}
      />
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

import { useState, useCallback } from "react";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Preview } from "@/components/Editor/Preview";
import { FileExplorer } from "@/components/Editor/FileExplorer";
import { Terminal } from "@/components/Terminal/Terminal";
import { WebContainerProvider } from "@/lib/webcontainer-context";
import { EditorPanel } from "@/components/Layout/EditorPanel";
import { useTabs } from "@/hooks/useTabs";
import { TopBar } from "@/components/Layout/TopBar";
import { useFiles } from "@/hooks/useFiles";

export function App() {
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const {
    files,
    isLoadingFiles,
    isUploading,
    handleReloadFiles,
    handleFileUpload,
    deleteFileOrFolder,
    renameFileOrFolder,
  } = useFiles();
  const {
    tabs,
    activeTab,
    activeTabContent,
    handleFileSelect,
    handleTabClose,
    handleCodeChange,
    setActiveTab,
    updateTabPath,
  } = useTabs();

  const handleRename = useCallback(
    (oldPath: string, newPath: string) => {
      renameFileOrFolder(oldPath, newPath);
      updateTabPath(oldPath, newPath);
    },
    [renameFileOrFolder, updateTabPath]
  );

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden scanlines">
      {!isPreviewFullscreen && (
        <TopBar
          isExplorerOpen={isExplorerOpen}
          onToggleExplorer={() => setIsExplorerOpen(!isExplorerOpen)}
        />
      )}
      {/* Main Content */}
      <main className="h-[calc(100vh-3.5rem)]">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <ResizablePanelGroup direction="horizontal">
              {/* File Explorer */}
              <ResizablePanel
                style={{ display: isExplorerOpen ? "block" : "none" }}
                defaultSize={15}
                minSize={10}
              >
                <FileExplorer
                  files={files}
                  isLoadingFiles={isLoadingFiles}
                  isUploading={isUploading}
                  onFileSelect={handleFileSelect}
                  onReload={handleReloadFiles}
                  onUpload={handleFileUpload}
                  onDelete={deleteFileOrFolder}
                  onRename={handleRename}
                />
              </ResizablePanel>
              <ResizableHandle className="bg-blue-500/20 hover:bg-secondary/50 transition-colors" />

              {/* Editor Panel */}
              <ResizablePanel defaultSize={40}>
                <EditorPanel
                  tabs={tabs}
                  activeTab={activeTab}
                  activeTabContent={activeTabContent}
                  onTabSelect={setActiveTab}
                  onTabClose={handleTabClose}
                  onCodeChange={handleCodeChange}
                />
              </ResizablePanel>

              <ResizableHandle className="bg-blue-500/20 hover:bg-secondary/50 transition-colors" />

              {/* Preview Panel */}
              <ResizablePanel defaultSize={45}>
                <div className="h-full flex flex-col bg-card/50">
                  <Preview
                    isFullscreen={isPreviewFullscreen}
                    onFullscreenChange={setIsPreviewFullscreen}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Terminal Panel */}
          <ResizableHandle className="bg-blue-500/20 hover:bg-secondary/50 transition-colors" />
          <ResizablePanel
            style={{ display: isTerminalOpen ? "block" : "none" }}
            defaultSize={30}
            minSize={10}
          >
            <div className="h-full bg-card/50 border-t border-blue-500/20">
              <div className="flex items-center justify-between px-4 py-1 border-b border-blue-500/20">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary">
                    Imperial Terminal
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-blue-500/20 hover:text-destructive"
                  onClick={() => setIsTerminalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[calc(100%-2rem)]">
                <Terminal />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Bouton flottant quand le terminal est fermé */}
        {!isTerminalOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed right-4 bottom-3 z-10 h-8 w-8 bg-card shadow-md border border-border/50 transition-all duration-200"
            onClick={() => setIsTerminalOpen(true)}
          >
            <TerminalIcon className="h-4 w-4" />
          </Button>
        )}
      </main>
    </div>
  );
}

export function AppWithProvider() {
  return (
    <WebContainerProvider>
      <App />
    </WebContainerProvider>
  );
}

import { useState, useCallback, useEffect } from "react";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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
import { cn } from "@/lib/utils";
import { MobileNavigation } from "@/components/Layout/MobileNavigation";

const MOBILE_VIEWS = {
  EDITOR: "editor",
  PREVIEW_AND_TERMINAL: "preview_and_terminal",
} as const;

type MobileView = (typeof MOBILE_VIEWS)[keyof typeof MOBILE_VIEWS];

export function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentMobileView, setCurrentMobileView] = useState<MobileView>(
    MOBILE_VIEWS.PREVIEW_AND_TERMINAL
  );
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
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

  useEffect(() => {
    const initialIsMobile = window.matchMedia("(max-width: 768px)").matches;
    setIsTerminalOpen(!initialIsMobile);
  }, []);

  const handleRename = useCallback(
    (oldPath: string, newPath: string) => {
      renameFileOrFolder(oldPath, newPath);
      updateTabPath(oldPath, newPath);
    },
    [renameFileOrFolder, updateTabPath]
  );

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden scanlines">
      {!isPreviewFullscreen && <TopBar />}

      <main className="h-[calc(100vh-3.5rem)]">
        <ResizablePanelGroup direction="vertical" className="h-full">
          {/* Contenu Principal (Editor + Preview) */}
          <ResizablePanel
            defaultSize={isMobile ? 85 : 70}
            minSize={30}
            className="transition-[height] duration-200"
          >
            <ResizablePanelGroup
              direction={isMobile ? "vertical" : "horizontal"}
              className="h-full"
            >
              {/* Partie Éditeur (Explorer + Code) */}
              <ResizablePanel
                defaultSize={isMobile ? 50 : 55}
                minSize={20}
                className={cn(
                  "transition-[width,height] duration-200",
                  isMobile &&
                    currentMobileView !== MOBILE_VIEWS.EDITOR &&
                    "hidden"
                )}
              >
                <ResizablePanelGroup direction="horizontal">
                  {/* File Explorer */}
                  <ResizablePanel
                    defaultSize={25}
                    minSize={15}
                    maxSize={40}
                    className={cn(
                      "transition-[width] duration-200",
                      !isExplorerOpen && "hidden"
                    )}
                  >
                    <FileExplorer
                      files={files}
                      isLoadingFiles={isLoadingFiles}
                      isUploading={isUploading}
                      onFileSelect={(path) => {
                        handleFileSelect(path);
                        if (isMobile) setIsExplorerOpen(false);
                      }}
                      onReload={handleReloadFiles}
                      onUpload={handleFileUpload}
                      onDelete={deleteFileOrFolder}
                      onRename={handleRename}
                    />
                  </ResizablePanel>

                  <ResizableHandle
                    className={cn(
                      "bg-blue-500/20 hover:bg-secondary/50 transition-colors duration-200",
                      !isExplorerOpen && "hidden"
                    )}
                  />

                  {/* Editor Panel */}
                  <ResizablePanel defaultSize={75}>
                    <EditorPanel
                      tabs={tabs}
                      activeTab={activeTab}
                      activeTabContent={activeTabContent}
                      onTabSelect={setActiveTab}
                      onTabClose={handleTabClose}
                      onCodeChange={handleCodeChange}
                      isExplorerOpen={isExplorerOpen}
                      onToggleExplorer={() =>
                        setIsExplorerOpen(!isExplorerOpen)
                      }
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle
                className={cn(
                  "bg-blue-500/20 hover:bg-secondary/50 transition-colors duration-200",
                  isMobile &&
                    currentMobileView !== MOBILE_VIEWS.PREVIEW_AND_TERMINAL &&
                    "hidden"
                )}
              />

              {/* Preview */}
              <ResizablePanel
                defaultSize={45}
                minSize={20}
                className={cn(
                  "transition-[width,height] duration-200",
                  isMobile &&
                    currentMobileView !== MOBILE_VIEWS.PREVIEW_AND_TERMINAL &&
                    "hidden"
                )}
              >
                <Preview
                  isFullscreen={isPreviewFullscreen}
                  onFullscreenChange={setIsPreviewFullscreen}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle
            className={cn(
              "bg-blue-500/20 hover:bg-secondary/50 transition-colors duration-200",
              !isTerminalOpen && "hidden"
            )}
          />

          {/* Terminal en bas */}
          <ResizablePanel
            defaultSize={isMobile ? 15 : 30}
            minSize={10}
            maxSize={isMobile ? 50 : 90}
            className={cn(
              "transition-[height] duration-200",
              !isTerminalOpen && "hidden"
            )}
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
                  className="h-6 w-6 hover:bg-blue-500/20 hover:text-destructive transition-colors duration-200"
                  onClick={() => setIsTerminalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div
                className={cn(
                  "h-[calc(100%-2rem)]",
                  isMobile && "h-[calc(100%-2rem-3.5rem)]"
                )}
              >
                <Terminal />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Bouton flottant du terminal */}
        <div className={cn(!isTerminalOpen || "hidden")}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "fixed right-4 z-10 h-8 w-8 bg-card shadow-md border border-border/50 transition-all duration-200",
              isMobile ? "bottom-16" : "bottom-3"
            )}
            onClick={() => setIsTerminalOpen(true)}
          >
            <TerminalIcon className="h-4 w-4" />
          </Button>
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className={cn(isMobile || "hidden")}>
        <MobileNavigation
          currentView={currentMobileView}
          onViewChange={setCurrentMobileView}
        />
      </div>
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

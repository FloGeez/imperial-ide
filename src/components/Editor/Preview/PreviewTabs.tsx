import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Pencil, Check } from "lucide-react";
import { PreviewServer } from "../Preview";

interface PreviewTabsProps {
  servers: PreviewServer[];
  activePort: number | null;
  onPortSelect: (port: number) => void;
  onUrlChange: (port: number, newUrl: string) => void;
}
export function PreviewTabs({
  servers,
  activePort,
  onPortSelect,
  onUrlChange,
}: PreviewTabsProps) {
  const [editingPort, setEditingPort] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEditStart = (server: PreviewServer) => {
    // Ne récupérer que la partie après le port pour l'édition
    const pathPart =
      server.displayUrl.replace(`localhost:${server.port}`, "") || "/";
    setEditingPort(server.port);
    setEditValue(pathPart);
  };

  const handleEditComplete = () => {
    if (editingPort) {
      // S'assurer que le chemin commence par un /
      const path = editValue.startsWith("/") ? editValue : `/${editValue}`;
      onUrlChange(editingPort, `localhost:${editingPort}${path}`);
      setEditingPort(null);
    }
  };

  return (
    <ScrollArea className="h-9">
      <div className="h-full flex items-center gap-1 px-2 bg-card/50 border-b border-border/50 overflow-x-auto">
        {servers.map(({ port, displayUrl }) => (
          <div
            key={port}
            className={cn(
              "group flex items-center gap-2 px-3 py-1 text-sm border-b-2 cursor-pointer",
              activePort === port
                ? "text-primary border-primary bg-primary/10"
                : "text-muted-foreground border-transparent hover:text-foreground hover:border-border/50"
            )}
            onClick={() => onPortSelect(port)}
          >
            {editingPort === port ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditComplete();
                }}
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-muted-foreground">localhost:{port}</span>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-6 w-[200px] py-1 px-2 text-xs"
                  autoFocus
                  onBlur={handleEditComplete}
                />
                <button type="submit" className="hover:text-primary">
                  <Check className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <>
                <span className="truncate max-w-[200px]">{displayUrl}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStart({ port, url: displayUrl, displayUrl });
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

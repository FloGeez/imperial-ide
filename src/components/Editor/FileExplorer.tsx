import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  RefreshCw,
  Upload,
  Trash2,
  Edit2,
} from "lucide-react";
import type { FileSystemNode } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
  files: FileSystemNode[];
  isLoadingFiles?: boolean;
  isUploading?: boolean;
  onFileSelect: (file: FileSystemNode) => void;
  onReload?: () => void;
  onUpload?: (files: FileList) => void;
  onDelete?: (path: string) => void;
  onRename?: (oldPath: string, newPath: string) => void;
}

export function FileExplorer({
  files,
  isLoadingFiles,
  isUploading,
  onFileSelect,
  onReload,
  onUpload,
  onDelete,
  onRename,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [localFiles, setLocalFiles] = useState<FileSystemNode[]>(files);

  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  const updateNodePath = (
    nodes: FileSystemNode[],
    oldPath: string,
    newPath: string
  ): FileSystemNode[] => {
    return nodes.map((node) => {
      if (node.path === oldPath) {
        return {
          ...node,
          path: newPath,
          name: newPath.split("/").pop() || "",
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodePath(node.children, oldPath, newPath),
        };
      }
      return node;
    });
  };

  const handleRename = async (oldPath: string, newPath: string) => {
    setLocalFiles((prev) => updateNodePath(prev, oldPath, newPath));
    setEditingPath(null);

    try {
      await onRename?.(oldPath, newPath);
    } catch (error) {
      console.error("Erreur lors du renommage:", error);
      setLocalFiles(files);
    }
  };

  const FileNode = ({
    node,
    depth = 0,
  }: {
    node: FileSystemNode;
    depth?: number;
  }) => {
    const isExpanded = expandedFolders.has(node.path);
    const isDirectory = node.type === "directory";
    const isEditing = editingPath === node.path;
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div>
        <div
          className="flex items-center gap-1 px-2 py-1 hover:bg-muted/50 cursor-pointer group"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (!isEditing) {
              if (isDirectory) {
                setExpandedFolders((prev) => {
                  const next = new Set(prev);
                  if (isExpanded) next.delete(node.path);
                  else next.add(node.path);
                  return next;
                });
              } else {
                onFileSelect(node);
              }
            }
          }}
        >
          <div className="flex-1 flex items-center gap-1 py-1">
            {isDirectory &&
              (isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ))}
            {isDirectory ? (
              <Folder className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}

            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputRef.current) {
                    const pathParts = node.path.split("/");
                    pathParts.pop();
                    const newPath = [...pathParts, inputRef.current.value].join(
                      "/"
                    );
                    handleRename(node.path, newPath);
                  }
                }}
                className="flex-1"
              >
                <Input
                  ref={inputRef}
                  defaultValue={node.name}
                  className="h-6 py-0"
                  autoFocus
                  onFocus={(e) => {
                    // Sélectionner le nom sans l'extension uniquement au focus initial
                    const value = e.target.value;
                    const dotIndex = value.lastIndexOf(".");
                    if (dotIndex > 0) {
                      e.target.setSelectionRange(0, dotIndex);
                    }
                  }}
                  onBlur={() => setEditingPath(null)}
                />
              </form>
            ) : (
              <span className="text-sm">{node.name}</span>
            )}
          </div>

          {!isEditing && (
            <div className="hidden group-hover:flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingPath(node.path);
                }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(node.path);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {isDirectory &&
          isExpanded &&
          node.children?.map((child) => (
            <FileNode key={child.path} node={child} depth={depth + 1} />
          ))}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full flex flex-col border-r border-border/50">
      <div className="p-1 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center">
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => e.target.files && onUpload?.(e.target.files)}
            webkitdirectory=""
            directory=""
            multiple
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7",
              isUploading && "animate-pulse-fast text-primary"
            )}
            onClick={() => document.getElementById("file-upload")?.click()}
            title="Importer un projet"
          >
            <Upload className="h-3 w-3" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          onClick={onReload}
          disabled={isLoadingFiles}
          title="Recharger les fichiers"
        >
          <RefreshCw
            className={`h-3 w-3 ${isLoadingFiles ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {localFiles.map((node) => (
          <FileNode key={node.path} node={node} />
        ))}
      </div>
    </ScrollArea>
  );
}

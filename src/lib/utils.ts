import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WebContainer } from "@webcontainer/api";
import { FileSystemNode } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Liste des fichiers et dossiers à ignorer
const IGNORED_PATHS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".cache",
  "coverage",
  ".DS_Store",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".env",
  ".env.local",
  ".vscode",
  ".idea",
]);

export async function webContainerToFileSystem(
  container: WebContainer,
  path: string = "/"
): Promise<FileSystemNode[]> {
  try {
    const entries = await container.fs.readdir(path, { withFileTypes: true });
    const nodes: FileSystemNode[] = [];

    for (const entry of entries) {
      const fullPath =
        path === "/" ? `/${entry.name}` : `${path}/${entry.name}`;

      // Ignorer les fichiers et dossiers de la liste
      if (IGNORED_PATHS.has(entry.name)) continue;

      // Ignorer les fichiers cachés (commençant par .)
      if (entry.name.startsWith(".") && entry.name !== ".env.example") continue;

      if (entry.isDirectory()) {
        const children = await webContainerToFileSystem(container, fullPath);
        nodes.push({
          name: entry.name,
          path: fullPath,
          type: "directory",
          children,
        });
      } else {
        const content = await container.fs.readFile(fullPath, "utf-8");
        nodes.push({
          name: entry.name,
          path: fullPath,
          type: "file",
          content,
        });
      }
    }

    return nodes.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error reading WebContainer files:", error);
    return [];
  }
}

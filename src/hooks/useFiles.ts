import { FileSystemNode } from "@/lib/types";
import { webContainerToFileSystem } from "@/lib/utils";
import { useWebContainer } from "@/lib/webcontainer-context";
import { useState, useCallback, useEffect } from "react";

// Liste des dossiers et fichiers à ignorer
const IGNORED_PATHS = [
  "node_modules",
  ".git",
  "dist",
  ".cache",
  ".DS_Store",
  "build",
];

export function useFiles() {
  const [files, setFiles] = useState<FileSystemNode[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { webcontainer, loading } = useWebContainer();

  const loadFiles = useCallback(async () => {
    if (!webcontainer || loading) return;

    setIsLoadingFiles(true);
    try {
      console.log("Chargement des fichiers depuis WebContainer...");
      const loadedFiles = await webContainerToFileSystem(webcontainer);
      console.log("Fichiers chargés:", loadedFiles);
      setFiles(loadedFiles);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [webcontainer, loading]);

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!webcontainer || loading) return;
      setIsUploading(true);

      try {
        // Supprimer tous les fichiers existants
        const existingFiles = await webcontainer.fs.readdir("/");
        for (const file of existingFiles) {
          try {
            await webcontainer.fs.rm(`/${file}`, { recursive: true });
          } catch (error) {
            console.error(`Erreur lors de la suppression de ${file}:`, error);
          }
        }

        const validFiles = Array.from(files).filter((file) => {
          const pathParts = file.webkitRelativePath.split("/");
          return !pathParts.some((part) => IGNORED_PATHS.includes(part));
        });

        // Séparer les fichiers : racine vs sous-dossiers
        const rootFiles: File[] = [];
        const subDirectoryFiles: File[] = [];

        validFiles.forEach((file) => {
          const pathParts = file.webkitRelativePath.split("/");
          // Si le fichier est directement sous le dossier importé (2 niveaux: dossier_importé/fichier)
          if (pathParts.length === 2) {
            rootFiles.push(file);
          } else {
            subDirectoryFiles.push(file);
          }
        });

        // Importer les fichiers racine
        for (const file of rootFiles) {
          const content = await file.text();
          await webcontainer.fs.writeFile(file.name, content);
        }

        // Importer les fichiers des sous-dossiers en préservant la structure
        for (const file of subDirectoryFiles) {
          const content = await file.text();
          const pathParts = file.webkitRelativePath.split("/");
          // Enlever le dossier racine importé du chemin
          const relativePath = pathParts.slice(1).join("/");

          // Créer les sous-dossiers si nécessaire
          const dirPath = relativePath.split("/").slice(0, -1).join("/");
          if (dirPath) {
            try {
              await webcontainer.fs.mkdir(dirPath, { recursive: true });
            } catch (error) {
              // Ignorer l'erreur si le dossier existe déjà
            }
          }

          // Écrire le fichier
          await webcontainer.fs.writeFile(relativePath, content);
        }

        console.log(
          `Import terminé : ${rootFiles.length} fichiers à la racine, ${subDirectoryFiles.length} fichiers dans les sous-dossiers`
        );
        await loadFiles();
      } finally {
        setIsUploading(false);
      }
    },
    [webcontainer, loading, loadFiles]
  );

  const deleteFileOrFolder = useCallback(
    async (path: string) => {
      if (!webcontainer || loading) return;

      try {
        try {
          await webcontainer.fs.readdir(path);
          // Si readdir réussit, c'est un dossier
          await webcontainer.fs.rm(path, { recursive: true });
        } catch {
          // Si readdir échoue, c'est un fichier
          await webcontainer.fs.rm(path);
        }
        await loadFiles();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    },
    [webcontainer, loading, loadFiles]
  );

  const renameFileOrFolder = useCallback(
    async (oldPath: string, newPath: string) => {
      if (!webcontainer || loading) return;

      try {
        await webcontainer.fs.rename(oldPath, newPath);
        await loadFiles();
      } catch (error) {
        console.error("Erreur lors du renommage:", error);
      }
    },
    [webcontainer, loading, loadFiles]
  );

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return {
    files,
    isLoadingFiles,
    isUploading,
    handleReloadFiles: loadFiles,
    handleFileUpload,
    deleteFileOrFolder,
    renameFileOrFolder,
  };
}

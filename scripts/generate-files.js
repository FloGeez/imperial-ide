import { promises as fs } from "fs";
import { join } from "path";
import { files } from "../src/lib/files.ts";

async function generateFiles() {
  const outputDir = join(process.cwd(), "files");

  async function createFileStructure(tree, currentPath) {
    for (const [name, item] of Object.entries(tree)) {
      const fullPath = join(currentPath, name);

      if ("directory" in item) {
        await fs.mkdir(fullPath, { recursive: true });
        await createFileStructure(item.directory, fullPath);
      } else if ("file" in item) {
        await fs.writeFile(fullPath, item.file.contents);
        console.log(`✓ Fichier créé : ${fullPath}`);
      }
    }
  }

  try {
    await fs.mkdir(outputDir, { recursive: true });
    console.log("📁 Création du dossier files");

    await createFileStructure(files, outputDir);

    console.log("\n✨ Génération terminée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la génération :", error);
  }
}

generateFiles();

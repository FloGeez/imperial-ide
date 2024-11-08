import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, relative } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateConfig() {
  const sourceDir = join(process.cwd(), "star-wars-app");
  const outputFile = join(process.cwd(), "src/lib/files.ts");

  async function readDirectoryStructure(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const structure = {};

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        structure[entry.name] = {
          directory: await readDirectoryStructure(fullPath),
        };
      } else {
        const contents = await fs.readFile(fullPath, "utf-8");
        structure[entry.name] = {
          file: {
            contents: contents,
          },
        };
      }
    }

    return structure;
  }

  try {
    console.log("📂 Lecture du dossier source...");
    const structure = await readDirectoryStructure(sourceDir);

    // Générer le contenu du fichier TypeScript
    const fileContent = `import { FileSystemTree } from "@webcontainer/api";

export const files: FileSystemTree = ${JSON.stringify(structure, null, 2)};
`;

    // Créer le dossier de destination si nécessaire
    await fs.mkdir(dirname(outputFile), { recursive: true });

    // Écrire le fichier
    await fs.writeFile(outputFile, fileContent);
    console.log(
      `✨ Fichier files.ts généré avec succès dans ${relative(
        process.cwd(),
        outputFile
      )}`
    );
  } catch (error) {
    console.error("❌ Erreur lors de la génération :", error);
    console.error(error);
  }
}

generateConfig();

import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export async function loadCompiledComponent(componentPath) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const absolutePath = path.resolve(__dirname, '../../', componentPath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Erreur lors du chargement du composant: ${error}`);
    return null;
  }
}
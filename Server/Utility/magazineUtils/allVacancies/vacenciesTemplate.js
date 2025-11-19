import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getTemplateHtml = () => {
  const filePath = path.join(__dirname, 'vacenciesTemplate.html');
  return fs.readFileSync(filePath, 'utf-8');
};

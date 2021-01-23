import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export default (pathFile) => {
  const extension = path.extname(pathFile);
  const fileContent = fs.readFileSync(pathFile, 'utf-8');
  switch (extension) {
    case '.json':
      return JSON.parse(fileContent);
    case '.yml':
      return yaml.load(fileContent);
    default:
      throw new Error(`Unknown extension ${extension}`);
  }
};

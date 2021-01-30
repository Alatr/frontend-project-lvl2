import path from 'path';
import fs from 'fs';

import parseFile from './parsers.js';
import gendiff from './gendiff.js';
import format from './formatters/index.js';

const readFile = (filePath) => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');

export default (filePath1, filePath2, formaterType) => {
  const fileContent1 = readFile(filePath1);
  const fileContent2 = readFile(filePath2);

  const fileData1 = parseFile(fileContent1, path.extname(filePath1).slice(1));
  const fileData2 = parseFile(fileContent2, path.extname(filePath2).slice(1));

  const diff = gendiff(fileData1, fileData2);

  return format(diff, formaterType);
};

import { test, expect } from '@jest/globals';

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import compareTwoFile from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.resolve(__dirname, '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe.each([
  ['stylish'],
  ['plain'],
  ['json'],
  [],
])('Test %s', (format) => {
  const expected = (format === undefined) ? readFile('stylish.txt') : readFile(`${format}.txt`);

  test.each([
    ['file1.json', 'file2.json'],
    ['file1.yml', 'file2.yml'],
    ['file1.yml', 'file2.json'],
    ['file1.json', 'file2.yml'],
  ])('%s -> %s', (fileName1, fileName2) => {
    const path1 = getFixturePath(fileName1);
    const path2 = getFixturePath(fileName2);
    expect(compareTwoFile(path1, path2, format)).toBe(expected);
  });
});

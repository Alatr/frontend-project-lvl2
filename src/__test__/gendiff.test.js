import { test, expect } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import _ from 'lodash';
import { compareTwoFile } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let json1;
let json1Copy;
let json2;
let json2Copy;

beforeEach(() => {
  json1 = readFile('file1.json');
  json2 = readFile('file2.json');
  json1Copy = _.cloneDeep(json1);
  json2Copy = _.cloneDeep(json2);
});

describe('gendiff', () => {
  test('check main flow', () => {
    const resultCompare = '{\n - follow: false\n   host: hexlet.io\n - proxy: 123.234.53.22\n - timeout: 50\n + timeout: 20\n + verbose: true\n}';
    expect(compareTwoFile(json1, json2)).toBe(resultCompare);
    expect(json1Copy).toEqual(json1);
    expect(json2Copy).toEqual(json2);
  });
  test('empty args', () => {
    const resultCompare = '{\n}';
    expect(compareTwoFile('{}', '{}')).toBe(resultCompare);
  });
});

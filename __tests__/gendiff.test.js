import { test, expect } from '@jest/globals';

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import compareTwoFile from '../src/index.js';
/*  */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.resolve(__dirname, '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
/* eslint-disable fp/no-let, fp/no-mutation */
let resultCompareStylish;
let resultComparePlain;
let resultCompareAST;
let yml1;
let yml2;
let json1;
let json2;
let emptyJSON;
let emptyYml;

let pathCases;

const testsName = [
  ['check main flow with json', 0],
  ['check main flow with yml', 1],
  ['check main flow with yml and json', 2],
  ['check main flow with json and yml', 3],
];

beforeAll(() => {
  resultCompareStylish = readFile('resultCompareStylish.txt');
  resultComparePlain = readFile('resultComparePlain.txt');
  resultCompareAST = readFile('resultCompareAST.json');
  yml1 = getFixturePath('file1.yml');
  yml2 = getFixturePath('file2.yml');
  json1 = getFixturePath('file1.json');
  json2 = getFixturePath('file2.json');
  emptyYml = getFixturePath('empty.yml');
  emptyJSON = getFixturePath('empty.json');

  pathCases = [
    [json1, json2],
    [yml1, yml2],
    [yml1, json2],
    [json1, yml2],
  ];
});

/* eslint-enable fp/no-let, fp/no-mutation */

describe('gendiff main flow', () => {
  test.each(testsName)('%s', (name, index) => {
    const [filePath1, filePath2] = pathCases[index];
    expect(compareTwoFile(filePath1, filePath2, 'stylish')).toBe(resultCompareStylish);
    expect(compareTwoFile(filePath1, filePath2, 'plain')).toBe(resultComparePlain);
    expect(compareTwoFile(filePath1, filePath2, 'json')).toBe(resultCompareAST);
  });
});

describe('gendiff empty arg', () => {
  test('empty args', () => {
    expect(compareTwoFile(emptyJSON, emptyYml, 'stylish')).toBe('{\n}');
    expect(compareTwoFile(emptyJSON, emptyYml, 'plain')).toBe('');
    expect(compareTwoFile(emptyJSON, emptyYml, 'json')).toBe('[]');
  });
});

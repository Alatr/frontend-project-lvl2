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
/* eslint-disable fp/no-let, fp/no-mutation*/
let resultCompareStylish;
let resultComparePlain;
let resultCompareAST;
let yml1;
let yml2;
let json1;
let json2;
let emptyJSON;
let emptyYml;

beforeAll(() => {
  resultCompareStylish = readFile('resultCompareStylish.txt');
  resultComparePlain = readFile('resultComparePlain.txt');
  resultCompareAST = readFile('resultCompareAST.json');
});
beforeEach(() => {
  yml1 = getFixturePath('file1.yml');
  yml2 = getFixturePath('file2.yml');
  json1 = getFixturePath('file1.json');
  json2 = getFixturePath('file2.json');
  emptyYml = getFixturePath('empty.yml');
  emptyJSON = getFixturePath('empty.json');
});
/* eslint-enable fp/no-let, fp/no-mutation*/

describe('gendiff main flow', () => {
  test('check main flow with json', () => {
    expect(compareTwoFile(json1, json2, 'stylish')).toBe(resultCompareStylish);
    expect(compareTwoFile(json1, json2, 'plain')).toBe(resultComparePlain);
    expect(compareTwoFile(json1, json2, 'json')).toBe(resultCompareAST);
  });
  //
  test('check main flow with yml', () => {
    expect(compareTwoFile(yml1, yml2, 'stylish')).toBe(resultCompareStylish);
    expect(compareTwoFile(yml1, yml2, 'plain')).toBe(resultComparePlain);
    expect(compareTwoFile(yml1, yml2, 'json')).toBe(resultCompareAST);
  });
  test('check main flow with yml and json', () => {
    expect(compareTwoFile(yml1, json2, 'stylish')).toBe(resultCompareStylish);
    expect(compareTwoFile(yml1, json2, 'plain')).toBe(resultComparePlain);
    expect(compareTwoFile(yml1, json2, 'json')).toBe(resultCompareAST);
  });
  test('check main flow with json and yml', () => {
    expect(compareTwoFile(json1, yml2, 'stylish')).toBe(resultCompareStylish);
    expect(compareTwoFile(json1, yml2, 'plain')).toBe(resultComparePlain);
    expect(compareTwoFile(json1, yml2, 'json')).toBe(resultCompareAST);
  });
});
describe('gendiff empty arg', () => {
  test('empty args', () => {
    expect(compareTwoFile(emptyJSON, emptyYml, 'stylish')).toBe('{\n}');
    expect(compareTwoFile(emptyJSON, emptyYml, 'plain')).toBe('');
    expect(compareTwoFile(emptyJSON, emptyYml, 'json')).toBe('[]');
  });
});

import { test, expect } from '@jest/globals';
import _ from 'lodash';

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { parseFile } from '../parsers.js';
import { compareTwoFile } from '../index.js';
/*  */
import * as stylish from '../formatters/stylish.js';
// import * as plain from '../formaters/plain.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let resultCompare;
let yml1;
let yml2;
let json1;
let json1Copy;
let json2;
let json2Copy;
let stylishFormat;

beforeAll(() => {
  stylishFormat = stylish;
  resultCompare = readFile('resultCompare.txt');
});
beforeEach(() => {
  yml1 = getFixturePath('file1.yml');
  yml2 = getFixturePath('file2.yml');
  json1 = getFixturePath('file1.json');
  json2 = getFixturePath('file2.json');
  json1Copy = _.cloneDeep(json1);
  json2Copy = _.cloneDeep(json2);
});

describe('gendiff main flow', () => {
  test('check main flow with json', () => {
    expect(compareTwoFile(json1, json2, stylishFormat)).toBe(resultCompare);
    expect(json1Copy).toEqual(json1);
    expect(json2Copy).toEqual(json2);
  });
  //
/*   test('check main flow with yml', () => {
    expect(compareTwoFile(yml1, yml2)).toBe(resultCompare);
  });
  test('check main flow with yml and json', () => {
    expect(compareTwoFile(yml1, json2)).toBe(resultCompare);
  });
  test('check main flow with json and yml', () => {
    expect(compareTwoFile(json1, yml2)).toBe(resultCompare);
  });
});
describe('gendiff empty arg', () => {
  test('empty args', () => {
    expect(compareTwoFile({}, {})).toBe('{\n\n}');
  }); */
});

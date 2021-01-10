import { test, expect } from '@jest/globals';
import _ from 'lodash';
import { compareTwoFile } from '../index.js';
import { readFile } from './pathes.js';
import resultFile1File2 from '../__fixtures__/resultFile1File2.js';



let yml1;
let yml2;
let json1;
let json1Copy;
let json2;
let json2Copy;

beforeEach(() => {
  yml1 = readFile('file1.yml');
  yml2 = readFile('file2.yml');
  json1 = readFile('file1.json');
  json2 = readFile('file2.json');
  json1Copy = _.cloneDeep(json1);
  json2Copy = _.cloneDeep(json2);
});

describe('gendiff', () => {
  test('check main flow with jsom', () => {
    expect(compareTwoFile(json1, json2)).toBe(resultFile1File2());
    expect(json1Copy).toEqual(json1);
    expect(json2Copy).toEqual(json2);
  });
  //
  test('check main flow with jsom', () => {
    expect(compareTwoFile(json1, json2)).toBe(resultFile1File2());
  });
  test('empty args', () => {
    const resultCompare = '{\n}';
    expect(compareTwoFile('{}', '{}')).toBe(resultCompare);
  });
});

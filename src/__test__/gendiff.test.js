import { test, expect } from '@jest/globals';
import _ from 'lodash';
import { compareTwoFile } from '../index.js';
import { getFixturePath } from './pathes.js';
import { parseFile } from '../parsers.js';

import resultFile1File2 from '../__fixtures__/resultFile1File2.js';

let yml1;
let yml2;
let json1;
let json1Copy;
let json2;
let json2Copy;

beforeEach(() => {
  yml1 = parseFile(getFixturePath('file1.yml'));
  yml2 = parseFile(getFixturePath('file2.yml'));
  json1 = parseFile(getFixturePath('file1.json'));
  json2 = parseFile(getFixturePath('file2.json'));
  json1Copy = _.cloneDeep(json1);
  json2Copy = _.cloneDeep(json2);
});

describe('gendiff', () => {
  test('check main flow with json', () => {
    expect(compareTwoFile(json1, json2)).toBe(resultFile1File2());
    expect(json1Copy).toEqual(json1);
    expect(json2Copy).toEqual(json2);
  });
  //
  test('check main flow with yml', () => {
    expect(compareTwoFile(yml1, yml2)).toBe(resultFile1File2());
  });
  test('empty args', () => {
    expect(compareTwoFile({}, {})).toBe('{\n}');
  });
});

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// const yaml = require('js-yaml');
// const fs   = require('fs');

// // Get document, or throw exception on error
// try {
//   const doc = yaml.load(fs.readFileSync('/home/ixti/example.yml', 'utf8'));
//   console.log(doc);
// } catch (e) {
//   console.log(e);
// }
export const parseFile = (pathFile) => {
  const extension = path.extname(pathFile);
  const fileContent = fs.readFileSync(pathFile, 'utf-8');
  switch (extension) {
    case '.json':
      return JSON.parse(fileContent);
      break;
    case '.yml':
      console.log(yaml.load(fileContent));
      return yaml.load(fileContent);
      break;

    default:
      throw new Error(`Unknown extension ${extension}`);
      break;
  }
};

export const compareTwoFile = (file1, file2) => {
  let result = '';

  const keys1 = _.keys(file1);
  const keys2 = _.keys(file2);

  const keys = _.union(keys1, keys2).sort();

  keys.forEach((key) => {
    if (!_.has(file1, key)) {
      result += ` + ${key}: ${file2[key]}\n`;
    } else if (!_.has(file2, key)) {
      result += ` - ${key}: ${file1[key]}\n`;
    } else if (file1[key] !== file2[key]) {
      result += ` - ${key}: ${file1[key]}\n`;
      result += ` + ${key}: ${file2[key]}\n`;
    } else {
      result += `   ${key}: ${file2[key]}\n`;
    }
  });

  return `{\n${result}}`;
};

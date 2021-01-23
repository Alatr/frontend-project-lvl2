import { Command } from 'commander';
import _ from 'lodash';
import process from 'process';
import path from 'path';
import parseFile from './parsers.js';
import getFormat from './formatters/index.js';

// gendiff src/__fixtures__/file1.json src/__fixtures__/file2.json

const predicates = {
  isDeleted: (key, obj) => !_.has(obj, key),
  isAdded: (key, obj) => !_.has(obj, key),
  isUnchanged: (key, obj1, obj2) => _.has(obj1, key) !== _.has(obj2, key),
  isChanged: (key, obj1, obj2) => obj1[key] !== obj2[key],
  isBothIsNotOdject(key, obj1, obj2) {
    return !_.isPlainObject(obj1[key]) && !_.isPlainObject(obj2[key]);
  },
  isOneOfIsOdject: (key, obj1, obj2) => !_.isPlainObject(obj1[key]) || !_.isPlainObject(obj2[key]),
};

export const compareTwoFile = (filePath1, filePath2, formaterType) => {
  const file1Content = parseFile(path.resolve(process.cwd(), filePath1));
  const file2Content = parseFile(path.resolve(process.cwd(), filePath2));

  const format = getFormat(formaterType);

  const startAccVal = format.getAcc();

  const iter = (object1, object2, acc) => {
    const keys = _.union(_.keys(object1), _.keys(object2)).sort();

    const lines = keys.map((key) => {
      /*  */
      if (predicates.isBothIsNotOdject(key, object1, object2)) {
        if (predicates.isAdded(key, object1)) {
          return format.addKeyMessage(key, object1, object2, acc);
        }
        if (predicates.isDeleted(key, object2)) {
          return format.deleteKeyMessage(key, object1, object2, acc);
        }
        if (predicates.isChanged(key, object1, object2)) {
          return format.changeKeyMessage(key, object1, object2, acc);
        }
        return format.unchangeKeyMessage(key, object2[key], acc);
      }
      /*  */

      if (predicates.isAdded(key, object1)) {
        return format.addKeyMessage(key, object1, object2, acc);
      }
      if (predicates.isDeleted(key, object2)) {
        return format.deleteKeyMessage(key, object1, object2, acc);
      }
      if (predicates.isOneOfIsOdject(key, object1, object2)) {
        return format.changeKeyMessage(key, object1, object2, acc);
      }
      const result = iter(object1[key], object2[key], format.incrementAcc(acc, key));
      return format.unchangeKeyMessage(key, result, acc);
    });

    const flatenLines = lines.flatMap((line) => line);

    return format.printResultMessage(flatenLines, acc);
  };

  return iter(file1Content, file2Content, startAccVal);
};

export const gendiff = () => {
  const program = new Command();

  program
    .version('0.1.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format', 'stylish');
  program
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2) => {
      const resultCompare = compareTwoFile(filepath1, filepath2, program.format);

      console.log(resultCompare);
    });

  program.parse(process.argv);
};

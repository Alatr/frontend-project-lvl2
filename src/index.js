import { Command } from 'commander';
import _ from 'lodash';
import process from 'process';
import path from 'path';
import { parseFile } from './parsers.js';

// gendiff src/__fixtures__/file1.json src/__fixtures__/file2.json

const predicates = {
  isDeleted: (key, obj) => !_.has(obj, key),
  isAdded: (key, obj) => !_.has(obj, key),
  isUnchanged: (key, obj1, obj2) => obj1[key] === obj2[key],
  isChanged: (key, obj1, obj2) => obj1[key] !== obj2[key],
};

const getLabelStausChange = (key, obj1, obj2) => {
  if (predicates.isAdded(key, obj1)) return '+';
  if (predicates.isDeleted(key, obj2)) return '-';
  if (predicates.isChanged(key, obj1, obj2)) return ' ';
  if (predicates.isUnchanged(key, obj1, obj2)) return ' ';
  return null;
};

// const stringifyJSON = (obj, indent) => {
//   const iter = (object, acc, treeDepth) => {
//     const depthIndent = '    '.repeat(treeDepth);
//     let newAcc = acc;

//     const keys = _.keys(object);
//     const lastKey = _.last(keys);
//     keys.forEach((key) => {
//       const lastIndent = (lastKey === key) ? '' : '\n';
//       if (_.isPlainObject(object[key])) {
//         const res = iter(object[key], '', treeDepth + 1);
//         newAcc += `${indent}${depthIndent}  ${key}: {\n${res}\n${indent}${depthIndent}  }${lastIndent}`;
//         return newAcc;
//       }
//       const value = (Array.isArray(object[key])) ? `[${object[key].toString()}]` : object[key];
//       newAcc += `${indent}${depthIndent}  ${key}: ${value}${lastIndent}`;
//       return newAcc;
//     });
//     return newAcc;
//   };
//   return `{\n${iter(obj, '', 1)}\n${indent}  }`;
// };

const stringifyJSON = (value, replacer = '  ', spacesCount = 2) => {

  const iter = (currentValue, depth) => {
    console.log(currentValue);
    if (!_.isPlainObject(currentValue)) {
      return currentValue.toString();
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 1)}`);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, 1);
};
let a = {
    "baz": "bas",
    "foo": "bar",
    "nest": {
      "key": "value"
    }
  }
console.log(stringifyJSON(a));

export const compareTwoFile = (file11, file22) => {
  const iter = (file1, file2, acc, treeDepth) => {
    let newAcc = acc;
    const keys1 = _.keys(file1);
    const keys2 = _.keys(file2);

    const keys = _.union(keys1, keys2).sort();
    const lastKey = _.last(keys);

    const depthIndent = '    '.repeat(treeDepth);

    keys.forEach((key) => {
      const lastIndent = (lastKey === key) ? '' : '\n';

      if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
        // const labelStausChange = getLabelStausChange(key, file1, file2);
        // const res = iter(file1[key], file2[key], '', treeDepth + 1);

        // newAcc += `  ${depthIndent} ${labelStausChange}${key}: {\n${res}\n${depthIndent}    }${lastIndent}`;
        // return newAcc;
      }
      /*  */
      if (predicates.isAdded(key, file1)) {
        newAcc += `  ${depthIndent}+ ${key}: ${(_.isPlainObject(file2[key])) ? stringifyJSON(file2[key], '    ') : file2[key]}`;
      } else if (predicates.isDeleted(key, file2)) {
        newAcc += `  ${depthIndent}- ${key}: ${(_.isPlainObject(file1[key])) ? stringifyJSON(file1[key]) : file1[key]}`;
      } else if (predicates.isChanged(key, file1, file2)) {
        newAcc += `  ${depthIndent}- ${key}: ${(_.isPlainObject(file1[key])) ? 'stringifyJSON(file1[key])' : file1[key]}`;
        newAcc += '\n';
        newAcc += `  ${depthIndent}+ ${key}: ${(_.isPlainObject(file2[key])) ? 'stringifyJSON(file2[key])' : file2[key]}`;
      } else {
        newAcc += `  ${depthIndent}  ${key}: ${(_.isPlainObject(file2[key])) ? stringifyJSON(file2[key]) : file2[key]}`;
      }
      /*  */
      if (lastKey !== key) newAcc += '\n';
      return true;
    });
    return newAcc;
  };

  return `{\n${iter(file11, file22, '', 0)}\n}`;
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
      const file1Content = parseFile(path.resolve(process.cwd(), filepath1));
      const file2Content = parseFile(path.resolve(process.cwd(), filepath2));

      const resultCompare = compareTwoFile(file1Content, file2Content, program.format);

      console.log(resultCompare);
    });

  program.parse(process.argv);
  // console.log('stylish', program.format);
};

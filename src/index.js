import { Command } from 'commander';
import _ from 'lodash';
import process from 'process';
import path from 'path';
import { parseFile } from './parsers.js';
import getFormat from './formatters/index.js';

// gendiff src/__fixtures__/file1.json src/__fixtures__/file2.json

const predicates = {
  isDeleted: (key, obj) => !_.has(obj, key),
  isAdded: (key, obj) => !_.has(obj, key),
  isUnchanged: (key, obj1, obj2) => _.has(obj1, key) !== _.has(obj2, key),
  // isChanged: (key, obj1, obj2) => obj1[key] !== obj2[key],
  // isChanged: (key, obj1, obj2) => _.has(obj1, key) === _.has(obj2, key),
  isChanged: (key, obj1, obj2) => obj1[key] !== obj2[key],
  isBothIsNotOdject: (key, obj1, obj2) => !_.isPlainObject(obj1[key]) && !_.isPlainObject(obj2[key]),

    // isUnchanged: (key, obj1, obj2) => obj1[key] === obj2[key],
    // isChanged: (key, obj1, obj2) => obj1[key] !== obj2[key],
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



/* 
  * addKeyMessage
  * deleteKeyMessage
  * changeKeyMessage
  * unchangeKeyMessage
  * addKeyMessage
 */

// export const compareTwoFile = (file11, file22) => {
//   const iter = (file1, file2, acc, treeDepth) => {
//     let newAcc = acc;
//     const keys1 = _.keys(file1);
//     const keys2 = _.keys(file2);

//     const keys = _.union(keys1, keys2).sort();
//     const lastKey = _.last(keys);

//     const depthIndent = '    '.repeat(treeDepth);

//     keys.forEach((key) => {
//       const lastIndent = (lastKey === key) ? '' : '\n';

//       if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
//         // const labelStausChange = getLabelStausChange(key, file1, file2);
//         // const res = iter(file1[key], file2[key], '', treeDepth + 1);

//         // newAcc += `  ${depthIndent} ${labelStausChange}${key}: {\n${res}\n${depthIndent}    }${lastIndent}`;
//         // return newAcc;
//       }
//       /*  */
//       if (predicates.isAdded(key, file1)) {
//         newAcc += `  ${depthIndent}+ ${key}: ${(_.isPlainObject(file2[key])) ? stringifyJSON(file2[key]) : file2[key]}`;
//       } else if (predicates.isDeleted(key, file2)) {
//         newAcc += `  ${depthIndent}- ${key}: ${(_.isPlainObject(file1[key])) ? stringifyJSON(file1[key]) : file1[key]}`;
//       } else if (predicates.isChanged(key, file1, file2)) {
//         newAcc += `  ${depthIndent}- ${key}: ${(_.isPlainObject(file1[key])) ? 'stringifyJSON(file1[key])' : file1[key]}`;
//         newAcc += '\n';
//         newAcc += `  ${depthIndent}+ ${key}: ${(_.isPlainObject(file2[key])) ? 'stringifyJSON(file2[key])' : file2[key]}`;
//       } else {
//         newAcc += `  ${depthIndent}  ${key}: ${(_.isPlainObject(file2[key])) ? stringifyJSON(file2[key]) : file2[key]}`;
//       }
//       /*  */
//       if (lastKey !== key) newAcc += '\n';
//       return true;
//     });
//     return newAcc;
//   };

//   return `{\n${iter(file11, file22, '', 0)}\n}`;
// };
export const compareTwoFile = (filePath1, filePath2, format) => {
  const file1Content = parseFile(path.resolve(process.cwd(), filePath1));
  const file2Content = parseFile(path.resolve(process.cwd(), filePath2));
  const startAccVal = format.getAcc();

  // const file1Content = {
  //   "setting1": "Value 1",
  //   "setting2": 200,
  //   "setting3": true,
  //   "setting6": {
  //     "key": "value",
  //     // "doge": {
  //     //   "wow": ""
  //     // }
  //   }
  // };
  // const file2Content = {
  //   "setting2": 100,
  //   "setting3": true,
  //   "setting4": false,
  //   "setting6": {
  //     "key": "value",
  //     // "key44": "qwerty",
  //     // "doge": {
  //     //   "wow": true
  //     // }
  //   }
  // };

  const iter = (object1, object2, acc) => {
    const keys = _.union(_.keys(object1), _.keys(object2)).sort();


    let lines = keys.map((key) => {
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
        return format.fl(key, object2[key], acc);
      }
      /*  */

      if (predicates.isAdded(key, object1)) {
        return format.addKeyMessage(key, object1, object2, acc);

      }
      if (predicates.isDeleted(key, object2)) {
        return format.deleteKeyMessage(key, object1, object2, acc);

      }
      if ( !_.isPlainObject(object1[key]) || !_.isPlainObject(object2[key])) {
          return format.changeKeyMessage(key, object1, object2, acc);
      }
      const result = iter(object1[key], object2[key], format.incrementAcc(acc, key))
      return format.unchangeKeyMessage(key, result);
    });
    
    const flatenLines = lines.flatMap((line) => line);
    
    return format.printResultMessage(flatenLines, acc);


    /*  */
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
      const format = getFormat(program.format);
      const resultCompare = compareTwoFile(filepath1, filepath2, format);

      console.log(resultCompare);
    });

  program.parse(process.argv);
  // console.log('stylish', program.format);
};

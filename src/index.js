import { Command } from 'commander';
import _ from 'lodash';
import process from 'process';
import path from 'path';
import { parseFile } from './parsers.js';

// gendiff src/__fixtures__/file1.json src/__fixtures__/file2.json

// const getExtension = (filepath) => path.extname(filepath);

// const getExtension = (filepath) => path.extname(filepath);
const indentSize = '  ';


const predicates = {
  isDeleted: (key, obj) => !_.has(obj, key),
  isAdded: (key, obj) => !_.has(obj, key),
  isUnchanged: (key, obj1, obj2) => obj1[key] === obj2[key],
  isChanged: (key, obj1, obj2) => obj1[key] !== obj2[key],
}

const getLabelStausChange = (key, obj1, obj2) => {
  if(predicates.isAdded(key, obj1)) return '+';
  if(predicates.isDeleted(key, obj2)) return '-';
  if(predicates.isChanged(key, obj1, obj2)) return ' ';
  if(predicates.isUnchanged(key, obj1, obj2)) return ' ';
}

const printResult = (key, obj, indent, state) => `${indent}${state} ${key}: ${(_.isPlainObject(obj[key])) ? stringifyJSON(obj[key], indent) : obj[key]}`;









const stringifyJSON = (obj, indent) => {
  const iter = (obj, acc, treeDepth) => {
    const depthIndent = indent.repeat(treeDepth);

    const keys = _.keys(obj);
    console.log(indent.length, depthIndent.length);
    const lastKey = _.last(keys);
    keys.forEach((key) => {
      const lastIndent = (lastKey === key) ? '' : '\n';
      if (_.isPlainObject(obj[key])) {
        let res = iter(obj[key], ``, treeDepth + 1);
        return acc += `  ${indent}${indentSize}  ${key}: {\n${res}\n${depthIndent}#}${lastIndent}`;
      }
      return acc += `  ${indent}${indentSize}  ${key}: ${obj[key]}${lastIndent}`;

    });
    return acc;
  }
  return `{\n${iter(obj, ``, 1)}\n${indent}  }`;
}









// const printResult = (key, obj, indent, state) => `${indent}  ${state} ${key}: ${obj[key]}\n`;


export const compareTwoFile = (file11, file22) => {
  let result = '';

  const iter = (file1, file2, acc, treeDepth) => {
    
    const keys1 = _.keys(file1);
    const keys2 = _.keys(file2);
    
    const keys = _.union(keys1, keys2).sort();
    const lastKey = _.last(keys);

    const depthIndent = indentSize.repeat(treeDepth)

    keys.forEach((key) => {
      const lastIndent = (lastKey === key) ? '' : '\n';
      
      if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
        // const labelStausChange = getLabelStausChange(key, file1, file2);
        // let res = iter(file1[key], file2[key], '', treeDepth + 1);
        // return acc += `${depthIndent}${labelStausChange} ${key}: {\n${res}\n${depthIndent}  }${lastIndent}`;
        
      }
      else if (predicates.isAdded(key, file1)) {
        // acc += `${depthIndent}  + ${key}: ${(_.isPlainObject(file2[key])) ? JSON.stringify(file2[key], undefined, 2) : file2[key]}\n`;
        acc += printResult(key, file2, depthIndent, '+');

      } else if (predicates.isDeleted(key, file2)) {
        // acc += `${depthIndent}  - ${key}: ${(_.isPlainObject(file1[key])) ? JSON.stringify(file1[key], undefined, 2) : file1[key]}\n`;
        acc += printResult(key, file1, depthIndent, '-');


      } else if (predicates.isChanged(key, file1, file2)) {
        // acc += `${depthIndent}  - ${key}: ${(_.isPlainObject(file1[key])) ? JSON.stringify(file1[key], undefined, 2) : file1[key]}\n`;
        // acc += `${depthIndent}  + ${key}: ${(_.isPlainObject(file2[key])) ? JSON.stringify(file2[key], undefined, 2) : file2[key]}\n`;
        acc += printResult(key, file1, depthIndent, '-');
        acc += '\n';
        acc += printResult(key, file2, depthIndent, '+');
        

      } else {
        // acc += `${depthIndent}    ${key}: ${(_.isPlainObject(file2[key])) ? JSON.stringify(file2[key], undefined, 2) : file2[key]}\n`;
        acc += printResult(key, file2, depthIndent, ' ');

      }
      if (lastKey !== key) acc += '\n';
    });
    return acc;
  }
  console.log(`{\n${iter(file11, file22, '', 1)}\n}`);
  
  return `{\n${result}}`;
};

















export const gendiff = () => {
  const program = new Command();

  program
    .version('0.1.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format');
  program
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2) => {
      const file1Content = parseFile(path.resolve(process.cwd(), filepath1));
      const file2Content = parseFile(path.resolve(process.cwd(), filepath2));

      const resultCompare = compareTwoFile(file1Content, file2Content);

      // console.log(resultCompare);
    });

  program.parse(process.argv);
};

import { Command } from 'commander';
import fs from 'fs';
import process from 'process';
import path from 'path';
import _ from 'lodash';

export default () => {

  const program = new Command();
  
  program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  ;

  program
  .arguments('<filepath1> <filepath2>')
  .action(function (filepath1, filepath2) {
    const jsonContent1 = fs.readFileSync(path.resolve(process.cwd(), filepath1), 'utf-8');
    const jsonContent2 = fs.readFileSync(path.resolve(process.cwd(), filepath2), 'utf-8');
    
    const resultCompare = compareTwoFile(jsonContent1, jsonContent2);

    console.log(resultCompare);
  });
  
  program.parse(process.argv);
}


function compareTwoFile(file1, file2) {
  let result = '';
  const data1 = JSON.parse(file1);
  const data2 = JSON.parse(file2);

  const keys1 = _.keys(data1);
  const keys2 = _.keys(data2);

  const keys = _.union(keys1, keys2).sort();

  for (const key of keys) {
    if (!_.has(data1, key)) {
      result += ` + ${key}: ${data2[key]}\n`;
    } else if (!_.has(data2, key)) {
      result += ` - ${key}: ${data1[key]}\n`;
    } else if (data1[key] !== data2[key]) {
      result += ` - ${key}: ${data1[key]}\n`;
      result += ` + ${key}: ${data2[key]}\n`;
    } else {
      result += `   ${key}: ${data2[key]}\n`;
    }
  }

  return `{\n${result}}`;
}
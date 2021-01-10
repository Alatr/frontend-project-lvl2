import { Command } from 'commander';
import fs from 'fs';
import process from 'process';
import path from 'path';
import { compareTwoFile } from './parsers.js';

// gendiff src/__fixtures__/file1.json src/__fixtures__/file2.json

const getExtension = (filepath) => path.extname(filepath);

const getExtension = (filepath) => path.extname(filepath);


export const gendiff = () => {
  const program = new Command();

  program
    .version('0.1.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format');
  program
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2) => {
      console.log(getExtension(path.resolve(process.cwd(), filepath1)));

      const file1Content = fs.readFileSync(path.resolve(process.cwd(), filepath1), 'utf-8');
      const file2Content = fs.readFileSync(path.resolve(process.cwd(), filepath2), 'utf-8');

      const resultCompare = compareTwoFile(file1Content, file2Content);

      console.log(resultCompare);
    });

  program.parse(process.argv);
};


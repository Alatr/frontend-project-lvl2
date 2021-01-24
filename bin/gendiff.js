#!/usr/bin/env node

import program from 'commander';
import process from 'process';

import compareTwoFile from '../src/index.js';

program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .allowUnknownOption()
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    console.log(program.format);
    const resultCompare = compareTwoFile(filepath1, filepath2, program.format);

    console.log(resultCompare);
  });

program.parse(process.argv);

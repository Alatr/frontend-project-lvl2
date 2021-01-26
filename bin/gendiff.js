#!/usr/bin/env node

import program from 'commander';
import process from 'process';

import gendiff from '../src/index.js';

program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, format) => {
    console.log(gendiff(filepath1, filepath2, format));
  });

program.parse(process.argv);

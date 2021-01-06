#!/usr/bin/env node

import { Command } from 'commander'
const program = new Command();
console.log('Usage: gendiff [options]');

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-h, --help', 'output usage information')

program.on('-h', () => {
  console.log('');
  console.log('Example call:');
  console.log('  $ custom-help --help');
});

program.parse(process.argv);


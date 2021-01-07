import { Command } from 'commander'

export default () => {

  const program = new Command();
  
  program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  ;
  program
  .arguments('<filepath1> <filepath2>')
  // .description('test command', {
    //   cmd: 'command to run',
    //   env: 'environment to run test in'
    // })
    // .action(function (cmd, env) {
      //   console.log('command:', cmd);
      //   console.log('environment:', env || 'no environment given');
      // });
      
      program.parse(process.argv);
      
}
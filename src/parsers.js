import _ from 'lodash';

// const yaml = require('js-yaml');
// const fs   = require('fs');

// // Get document, or throw exception on error
// try {
//   const doc = yaml.load(fs.readFileSync('/home/ixti/example.yml', 'utf8'));
//   console.log(doc);
// } catch (e) {
//   console.log(e);
// }


export const compareTwoFile = (file1, file2) => {
  let result = '';
  const data1 = JSON.parse(file1);
  const data2 = JSON.parse(file2);

  const keys1 = _.keys(data1);
  const keys2 = _.keys(data2);

  const keys = _.union(keys1, keys2).sort();

  keys.forEach((key) => {
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
  });

  return `{\n${result}}`;
};
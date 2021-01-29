import _ from 'lodash';
import path from 'path';
import fs from 'fs';

import parseFile from './parsers.js';
import getFormat from './formatters/index.js';

const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const getDiff = (object1, object2) => {
  const keys = _.sortBy(_.union(_.keys(object1), _.keys(object2)));

  return keys.map((key) => {
    if (_.isPlainObject(object1[key]) && _.isPlainObject(object2[key])) {
      return {
        key, value: 'complex', status: 'nested', children: getDiff(object1[key], object2[key]),
      };
    }
    if (!_.has(object1, key)) return { key, value: object2[key], status: 'added' };

    if (!_.has(object2, key)) return { key, value: object1[key], status: 'removed' };

    if (object1[key] !== object2[key]) {
      return {
        key, value: object2[key], oldValue: object1[key], status: 'updated',
      };
    }

    return { key, value: object2[key], status: 'unchanged' };
  });
};

export default (filePath1, filePath2, formaterType) => {
  const contentFile1 = readFile(path.resolve(process.cwd(), filePath1));
  const contentFile2 = readFile(path.resolve(process.cwd(), filePath2));

  const dataFile1 = parseFile(contentFile1, path.extname(filePath1).slice(1));
  const dataFile2 = parseFile(contentFile2, path.extname(filePath2).slice(1));

  const formater = getFormat(formaterType);

  const diff = getDiff(dataFile1, dataFile2);

  return formater(diff);
};

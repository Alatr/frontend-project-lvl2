import _ from 'lodash';
import path from 'path';
import fs from 'fs';

import parseFile from './parsers.js';
import getFormat from './formatters/index.js';

const predicates = {
  isDeleted: (key, obj) => !_.has(obj, key),
  isAdded: (key, obj) => !_.has(obj, key),
  isUnchanged: (key, obj1, obj2) => _.has(obj1, key) !== _.has(obj2, key),
  isChanged: (key, obj1, obj2) => obj1[key] !== obj2[key],
  isBothIsNotOdject(key, obj1, obj2) {
    return !_.isPlainObject(obj1[key]) && !_.isPlainObject(obj2[key]);
  },
  isOneOfIsOdject: (key, obj1, obj2) => !_.isPlainObject(obj1[key]) || !_.isPlainObject(obj2[key]),
};

const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const getDiff = (obj1, obj2) => {
  const iter = (object1, object2) => {
    const keys = _.sortBy(_.union(_.keys(object1), _.keys(object2)));

    const lines = keys.map((key) => {
      if (predicates.isBothIsNotOdject(key, object1, object2)) {
        if (predicates.isAdded(key, object1)) {
          return { key, value: object2[key], status: 'added' };
        }
        if (predicates.isDeleted(key, object2)) {
          return { key, value: object1[key], status: 'removed' };
        }
        if (predicates.isChanged(key, object1, object2)) {
          return {
            key, value: object2[key], oldValue: object1[key], status: 'updated',
          };
        }
        return { key, value: object2[key], status: 'unchanged' };
      }

      if (predicates.isAdded(key, object1)) {
        return { key, value: object2[key], status: 'added' };
      }
      if (predicates.isDeleted(key, object2)) {
        return { key, value: object1[key], status: 'removed' };
      }
      if (predicates.isOneOfIsOdject(key, object1, object2)) {
        return {
          key, value: object2[key], oldValue: object1[key], status: 'updated',
        };
      }
      const result = iter(object1[key], object2[key]);
      return {
        key, value: 'complex', status: 'unchanged', children: result,
      };
    });

    return lines;
  };

  return iter(obj1, obj2);
};

export default (filePath1, filePath2, formaterType) => {
  const absolutePathFile1 = path.resolve(process.cwd(), filePath1);
  const absolutePathFile2 = path.resolve(process.cwd(), filePath2);

  const contentFile1 = readFile(absolutePathFile1);
  const contentFile2 = readFile(absolutePathFile2);

  const dataFile1 = parseFile(contentFile1, path.extname(absolutePathFile1));
  const dataFile2 = parseFile(contentFile2, path.extname(absolutePathFile2));

  const formater = getFormat(formaterType);

  const diff = getDiff(dataFile1, dataFile2);

  return formater(diff);
};

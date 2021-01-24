import _ from 'lodash';
import path from 'path';
import parseFile from './parsers.js';
import getFormat from './formatters/index.js';

// gendiff src/__fixtures__/file1.json src/__fixtures__/file2.json

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

export default (filePath1, filePath2, formaterType) => {
  const file1Content = parseFile(path.resolve(process.cwd(), filePath1));
  const file2Content = parseFile(path.resolve(process.cwd(), filePath2));
  const formater = getFormat(formaterType);

  const accumValue = formater.getAcc();

  const iter = (object1, object2, acc) => {
    const keys = _.sortBy(_.union(_.keys(object1), _.keys(object2)));

    const lines = keys.map((key) => {
      /*  */
      if (predicates.isBothIsNotOdject(key, object1, object2)) {
        if (predicates.isAdded(key, object1)) {
          return formater.addKeyMessage(key, object1, object2, acc);
        }
        if (predicates.isDeleted(key, object2)) {
          return formater.deleteKeyMessage(key, object1, object2, acc);
        }
        if (predicates.isChanged(key, object1, object2)) {
          return formater.changeKeyMessage(key, object1, object2, acc);
        }
        return formater.unchangeKeyMessage(key, object2[key], acc);
      }
      /*  */

      if (predicates.isAdded(key, object1)) {
        return formater.addKeyMessage(key, object1, object2, acc);
      }
      if (predicates.isDeleted(key, object2)) {
        return formater.deleteKeyMessage(key, object1, object2, acc);
      }
      if (predicates.isOneOfIsOdject(key, object1, object2)) {
        return formater.changeKeyMessage(key, object1, object2, acc);
      }
      const result = iter(object1[key], object2[key], formater.incrementAcc(acc, key));
      return formater.unchangeKeyMessage(key, result, acc);
    });

    const flatenLines = lines.flatMap((line) => line);

    return formater.printResultMessage(flatenLines, acc);
  };

  return iter(file1Content, file2Content, accumValue);
};

import _ from 'lodash';

const gendiff = (object1, object2) => {
  const keys = _.sortBy(_.union(_.keys(object1), _.keys(object2)));

  return keys.map((key) => {
    if (!_.has(object2, key)) return { key, value: object1[key], status: 'removed' };

    if (!_.has(object1, key)) return { key, value: object2[key], status: 'added' };

    if (_.isPlainObject(object1[key]) && _.isPlainObject(object2[key])) {
      return {
        key, status: 'nested', children: gendiff(object1[key], object2[key]),
      };
    }

    if (_.isEqual(object1[key], object2[key])) {
      return { key, value: object2[key], status: 'unchanged' };
    }

    return {
      key, value: object2[key], oldValue: object1[key], status: 'updated',
    };
  });
};
export default gendiff;

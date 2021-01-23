import _ from 'lodash';

function createObjectLabel(object, value, label = '[complex value]') {
  return `${_.isPlainObject(object) ? label : value}`;
}
function createQuotesAroundString(object) {
  return (_.isString(object)) ? `'${object}'` : object;
}

export const addKeyMessage = (key, obj1, obj2, depth) => {
  const value = createQuotesAroundString(obj2[key]);
  return `Property '${depth}${key}' was added with value: ${createObjectLabel(obj2[key], value)}`;
};
/*  */
/*  */
export const deleteKeyMessage = (key, obj1, obj2, depth) => `Property '${depth}${key}' was removed`;
/*  */
/*  */
export const unchangeKeyMessage = (key, val) => ((val.slice(0, 9) !== 'Property ') ? [] : val);
/*  */
/*  */
export const changeKeyMessage = (key, obj1, obj2, depth) => {
  const oldValue = createQuotesAroundString(obj1[key]);
  const newValue = createQuotesAroundString(obj2[key]);

  return `Property '${depth}${key}' was updated. From ${createObjectLabel(obj1[key], oldValue)} to ${createObjectLabel(obj2[key], newValue)}`;
};
/*  */
/*  */

/*  */
export const printResultMessage = (lines) => [...lines].join('\n');
export const getAcc = () => '';
export const incrementAcc = (acc, val) => `${acc + val}.`;

/*  */

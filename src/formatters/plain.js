import _ from 'lodash';

const acc = [];
const spacesCount = 1;
export const addKeyMessage = (key, obj1, obj2, depth) => {
  const value = (_.isString(obj2[key])) ? `'${obj2[key]}'` : obj2[key]
  return `Property '${depth}${key}' was added with value: ${_.isPlainObject(obj2[key]) ? '[complex value]' : value}`;
  acc.push(`Property '${depth}${key}' was added with value: ${_.isPlainObject(obj2[key]) ? '[complex value]' : value}`);
}
/*  */
/*  */
export const deleteKeyMessage = (key, obj1, obj2, depth) => {
  return `Property '${depth}${key}' was removed`;
  acc.push(`Property '${depth}${key}' was removed`);
} 
/*  */
/*  */
export const unchangeKeyMessage = (key, val, depth) => {
  
  if (!_.isPlainObject(val)) {return val};
}
/*  */
/*  */
export const changeKeyMessage = (key, obj1, obj2, depth) => {
  const oldValue = (_.isString(obj1[key])) ? `'${obj1[key]}'` : obj1[key];
  const newValue = (_.isString(obj2[key])) ? `'${obj2[key]}'` : obj2[key];


  return `Property '${depth}${key}' was updated. From ${_.isPlainObject(obj1[key]) ? '[complex value]' : oldValue} to ${_.isPlainObject(obj2[key]) ? '[complex value]' : newValue}`
  acc.push(`Property '${depth}${key}' was updated. From ${_.isPlainObject(obj1[key]) ? '[complex value]' : oldValue} to ${_.isPlainObject(obj2[key]) ? '[complex value]' : newValue}`)

}
/*  */
/*  */

/*  */
export const printResultMessage = (lines, depth) => {
    return [...lines].join('\n');
}
export const getAcc = () => '';
export const incrementAcc = (acc, val) => acc + val + '.';

/*  */

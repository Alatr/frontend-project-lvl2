import _ from 'lodash';

const replacer = '  ';
const spacesCount = 1;

export const addMessage = (key, obj1, obj2, depth) => {
  const indent = replacer.repeat((depth !== 1) ? depth+1 : 1 * spacesCount);

  return `${indent}+ ${key}: ${_.isPlainObject(obj2[key]) ? stringifyJSON(obj2[key], indent) : obj2[key]}`;
}
/*  */
/*  */
export const deleteMessage = (key, obj1, obj2, depth) => {
  const indent = replacer.repeat((depth !== 1) ? depth+1 : 1 * spacesCount);
  return `${indent}- ${key}: ${_.isPlainObject(obj1[key]) ? stringifyJSON(obj1[key], indent) : obj1[key]}`;
} 
/*  */
/*  */
export const unchangeMessage = (key, val, depth) => {
  const indent = replacer.repeat((depth !== 1) ? depth+1 : 1 * spacesCount);
  
  return `${indent}  ${key}: ${val}`;
}
/*  */
/*  */
export const changeMessage = (key, obj1, obj2, indent) => [deleteMessage(key, obj1, obj2, indent), addMessage(key, obj1, obj2, indent)]
/*  */
/*  */


const stringifyJSON = (value, prevDepth = '', replacer = '  ', spacesCount = 2) => {

  const iter = (currentValue, depth) => {
    if (!_.isPlainObject(currentValue)) {
      return currentValue.toString();
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `  ${prevDepth}${currentIndent}${key}: ${iter(val, depth + 1)}`);

    return [
      '{',
      ...lines,
      `${prevDepth}${bracketIndent}  }`,
    ].join('\n');
  };

  return iter(value, 1);
};
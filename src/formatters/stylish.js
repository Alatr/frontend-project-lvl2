import _ from 'lodash';


export const addMessage = (key, obj1, obj2, indent) => `${indent}+ ${key}: ${_.isPlainObject(obj2[key]) ? stringifyJSON(obj2[key]) : obj2[key]}`
export const deleteMessage = (key, obj1, obj2, indent) => `${indent}- ${key}: ${_.isPlainObject(obj1[key]) ? stringifyJSON(obj1[key]) : obj1[key]}`
export const changeMessage = (key, obj1, obj2, indent) => [deleteMessage(key, obj1, obj2, indent), addMessage(key, obj1, obj2, indent)]
export const unchangeMessage = (key, obj1, obj2, indent) => `${indent}  ${key}: ${obj2[key]}`
// obj2[key]
const stringifyJSON = (value, replacer = '  ', spacesCount = 1, prevDepth = '') => {

  const iter = (currentValue, depth) => {
    if (!_.isPlainObject(currentValue)) {
      // console.log(currentValue);
      return currentValue.toString();
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${prevDepth}${currentIndent}${key}: ${iter(val, depth + 1)}`);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, 1);
};
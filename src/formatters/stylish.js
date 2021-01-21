import _ from 'lodash';

const replacer = '  ';
const spacesCount = 1;
const acc = [];


export const addKeyMessage = (key, obj1, obj2, depth) => {
  // const newDepth = (_.isPlainObject(obj2[key])) ? depth + 1  : depth;
  
  const indent = replacer.repeat(depth);

  acc.push(`${indent}+ ${key}: ${_.isPlainObject(obj2[key]) ? stringifyJSON(obj2[key], indent) : obj2[key]}`);
}
/*  */
/*  */
export const deleteKeyMessage = (key, obj1, obj2, depth) => {
  // const newDepth = (!_.isPlainObject(obj1[key])) ? depth + 1 : depth;

  const indent = replacer.repeat(depth);
  acc.push(`${indent}- ${key}: ${_.isPlainObject(obj1[key]) ? stringifyJSON(obj1[key], indent) : obj1[key]}`);
} 
/*  */
/*  */
export const fl = (key, val, depth) => {
  const newDepth = depth;
  const indent = replacer.repeat(newDepth);
  acc.push(`@${indent}  ${key}: ${val}`);

}
export const unchangeKeyMessage = (key, val, depth) => {
  const newDepth = depth;
  const indent = replacer.repeat(newDepth);
  
  // acc.push(`${indent}  ${key}: ${val}`);
  // return val;
  acc.push(`#${indent}  $key: ${key}`);
  return `##`;

}
/*  */
/*  */
export const changeKeyMessage = (key, obj1, obj2, indent) => [deleteKeyMessage(key, obj1, obj2, indent), addKeyMessage(key, obj1, obj2, indent)]
/*  */
/*  */

/*  */
export const printResultMessage = (lines, depth) => {
  const newDepth = (depth === 1) ? 0 : depth;
    // const indentSize = newDepth * spacesCount;
    const bracketIndent = replacer.repeat(newDepth);

    return [
      '{',
      ...acc,
      `${bracketIndent}}`,
    ].join('\n');
}
/*  */
const stringifyJSON = (value, prevDepth = '', spacesCount = 1, replacer = '    ') => {

  const iter = (currentValue, depth) => {
    if (!_.isPlainObject(currentValue)) {
      return currentValue;
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

export const getAcc = () => 1;
export const incrementAcc = (acc, val) => acc + 1;

// acc + key+'.'